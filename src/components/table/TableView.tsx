"use client";

import {
  type CSSProperties,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  MdArrowDownward,
  MdArrowUpward,
  MdFilterList,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineFilterAlt,
} from "react-icons/md";
import Filter, { IFilterControl } from "./components/filter/Filter";
import NotFound from "./components/notFound";
import {
  IHeaderItem,
  ITablePaginationProps,
  type TableDensity,
  type TableHeaderVariant,
  type TableOverflowMode,
  type TableRowVariant,
} from "./Table";

interface IProps<TData = unknown> extends React.HTMLAttributes<HTMLDivElement> {
  header: IHeaderItem<TData>[];
  accessibleName?: string;
  caption?: ReactNode;
  onFilterChange?: (value: string) => void;
  children?: ReactNode;
  showPagination?: boolean;
  pagination?: ITablePaginationProps;
  totalWidthUnits?: number;
  overflowMode?: TableOverflowMode;
  adaptiveBreakpoint?: number;
  stickyHeader?: boolean;
  scrollAreaMaxHeight?: CSSProperties["maxHeight"];
  rowVariant?: TableRowVariant;
  headerVariant?: TableHeaderVariant;
  density?: TableDensity;
}

const HEADER_VARIANT_CLASSES: Record<TableHeaderVariant, string> = {
  default: "bg-surface-card text-content-muted",
  brand: "bg-action-primary text-action-primary-content",
  dark: "bg-surface-action-neutral text-content-inverse",
  neutral: "bg-surface-muted text-content-primary",
};

const HEADER_DENSITY_CLASSES: Record<
  TableDensity,
  { row: string; cell: string }
> = {
  comfortable: { row: "h-10", cell: "px-2" },
  compact: { row: "h-8", cell: "px-2 py-1" },
};

function TableView<TData>({
  children,
  header,
  accessibleName,
  caption,
  className,
  onFilterChange,
  showPagination,
  pagination,
  totalWidthUnits,
  overflowMode = "scroll",
  adaptiveBreakpoint = 440,
  stickyHeader = false,
  scrollAreaMaxHeight,
  rowVariant = "plain",
  headerVariant = "default",
  density = "comfortable",
}: IProps<TData>) {
  const tableId = useId();
  const [openFilter, setOpenFilter] = useState<number | null>(null);
  const [filterMaxHeight, setFilterMaxHeight] = useState<number>();
  const [filterCoords, setFilterCoords] = useState<{
    top: number;
    left?: number;
  } | null>(null);
  const [tableWidth, setTableWidth] = useState<number>();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const headerCellRefs = useRef<Array<HTMLTableCellElement | null>>([]);
  const filterTriggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = tableWrapperRef.current;
    if (!wrapper) return;

    const updateWidth = () => setTableWidth(wrapper.clientWidth);
    if (typeof ResizeObserver === "undefined") {
      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }

    const observer = new ResizeObserver(updateWidth);
    observer.observe(wrapper);
    updateWidth();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (openFilter === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpenFilter(null);
      setFilterCoords(null);
      window.requestAnimationFrame(() => {
        filterTriggerRefs.current[openFilter]?.focus();
      });
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openFilter]);

  useEffect(() => {
    const updateFilterMaxHeight = () => {
      const nextHeight = scrollContainerRef.current?.clientHeight;
      if (!nextHeight) return;
      setFilterMaxHeight(Math.max(nextHeight - 24, 160));
    };

    updateFilterMaxHeight();
    window.addEventListener("resize", updateFilterMaxHeight);

    return () => {
      window.removeEventListener("resize", updateFilterMaxHeight);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableWrapperRef.current &&
        !tableWrapperRef.current.contains(event.target as Node)
      ) {
        setOpenFilter(null);
        setFilterCoords(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!filterRef.current || !filterCoords) return;

    filterRef.current.style.top = `${filterCoords.top}px`;
    filterRef.current.style.left =
      typeof filterCoords.left === "number" ? `${filterCoords.left}px` : "";
  }, [filterCoords]);

  useEffect(() => {
    if (openFilter === null) return;

    const frame = window.requestAnimationFrame(() => {
      filterRef.current
        ?.querySelector<HTMLElement>(
          "input, button, [tabindex]:not([tabindex='-1'])",
        )
        ?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [openFilter]);

  const handleOpenFilter = (index: number) => {
    const next = openFilter === index ? null : index;
    setOpenFilter(next);

    if (next !== null) {
      const wrapperRect = tableWrapperRef.current?.getBoundingClientRect();
      const cellRect = headerCellRefs.current[next]?.getBoundingClientRect();

      if (wrapperRect && cellRect) {
        const top = cellRect.bottom - wrapperRect.top + 8;
        const dropdownWidth = Math.min(
          320,
          Math.max(wrapperRect.width - 16, 0),
        );
        const desiredLeft = cellRect.left - wrapperRect.left;
        const minLeft = 8;
        const maxLeft = Math.max(
          minLeft,
          wrapperRect.width - dropdownWidth - 8,
        );
        const left = Math.min(Math.max(desiredLeft, minLeft), maxLeft);

        setFilterCoords({ top, left });
      }
    } else {
      setFilterCoords(null);
    }
  };

  const closeFilterAndRestoreFocus = () => {
    const activeFilter = openFilter;
    setOpenFilter(null);
    setFilterCoords(null);
    if (activeFilter !== null) {
      window.requestAnimationFrame(() => {
        filterTriggerRefs.current[activeFilter]?.focus();
      });
    }
  };

  const hasFilterEnabled = (item: IHeaderItem<TData>) =>
    Boolean(item.filters?.optionList?.length || item.filters?.controls?.length);

  const getHeaderIcon = (item: IHeaderItem<TData>) => {
    if (!hasFilterEnabled(item)) {
      return null;
    }

    const controls = item.filters?.controls ?? [];
    const hasActiveSearchOrOptionFilter = controls.some((control) => {
      if (control.type === "search") {
        return Boolean(control.value?.trim());
      }

      if (control.type === "options") {
        return Boolean(control.value && control.value !== "__all__");
      }

      return false;
    });

    if (hasActiveSearchOrOptionFilter) {
      return <MdFilterList className="h-3.5 w-3.5" />;
    }

    const activeSort = controls.find(
      (control) =>
        control.type === "sort" &&
        control.value &&
        control.value !== "__all__" &&
        control.value !== "default",
    );

    if (activeSort?.value === "asc") {
      return <MdArrowUpward className="h-3.5 w-3.5" />;
    }

    if (activeSort?.value === "desc") {
      return <MdArrowDownward className="h-3.5 w-3.5" />;
    }

    const legacyOptionActive =
      item.filters?.optionChecked &&
      item.filters.optionChecked !== "__all__" &&
      item.filters.optionChecked !== "default";

    if (legacyOptionActive) {
      return <MdFilterList className="h-3.5 w-3.5" />;
    }

    return <MdOutlineFilterAlt className="h-3.5 w-3.5" />;
  };

  const getSortDirection = (item: IHeaderItem<TData>) => {
    const sortControl = item.filters?.controls?.find(
      (control) => control.type === "sort",
    );

    if (!sortControl) return undefined;
    if (sortControl.value === "asc") return "ascending" as const;
    if (sortControl.value === "desc") return "descending" as const;
    return "none" as const;
  };

  const handleHeaderAction = (item: IHeaderItem<TData>, index: number) => {
    if (hasFilterEnabled(item)) {
      handleOpenFilter(index);
      return;
    }
  };

  const handleFilterChange = (
    item: IHeaderItem<TData>,
    value: string,
    control?: IFilterControl,
  ) => {
    if (control?.type !== "search") {
      setOpenFilter(null);
    }

    if (control) {
      item.filters?.onControlChange?.(control, value);
    } else {
      item.filters?.onChange?.(value);
    }

    if (onFilterChange) {
      onFilterChange(value);
    }
  };

  const resolvedTotalWidthUnits =
    totalWidthUnits ??
    (header.reduce((sum, item) => sum + (item.widthUnits ?? 0), 0) ||
      undefined);

  const getColumnWidth = (widthUnits?: number) => {
    if (!resolvedTotalWidthUnits || !widthUnits) {
      return undefined;
    }

    return `${(widthUnits / resolvedTotalWidthUnits) * 100}%`;
  };

  const isNarrowContainer = tableWidth !== undefined && tableWidth < 640;
  const paginationVariant = isNarrowContainer
    ? "arrows"
    : (pagination?.variant ?? "default");
  const isAdaptiveCompact =
    overflowMode === "adaptive" &&
    tableWidth !== undefined &&
    tableWidth < adaptiveBreakpoint;
  const overflowClass =
    overflowMode === "scroll" ? "overflow-x-auto" : "overflow-x-hidden";
  const resolvedScrollAreaMaxHeight = stickyHeader
    ? (scrollAreaMaxHeight ?? "calc(100dvh - 240px)")
    : scrollAreaMaxHeight;
  const headerFocusClass =
    headerVariant === "brand" || headerVariant === "dark"
      ? "focus-visible:outline-current"
      : "focus-visible:outline-focus-ring";

  return (
    <div
      ref={tableWrapperRef}
      className={`relative flex h-full min-h-0 min-w-0 flex-col ${
        isAdaptiveCompact ? "table-adaptive-compact" : ""
      }`}
    >
      <div
        ref={scrollContainerRef}
        data-sticky-header={stickyHeader}
        data-row-variant={rowVariant}
        data-header-variant={headerVariant}
        data-table-density={density}
        data-responsive-mode={overflowMode}
        style={{ maxHeight: resolvedScrollAreaMaxHeight }}
        className={`min-h-0 min-w-0 flex-1 overflow-y-auto ${overflowClass}`}
      >
        <table
          aria-label={
            caption
              ? undefined
              : (accessibleName ??
                `Tabela: ${header.map((item) => item.title).join(", ")}`)
          }
          className={`w-full max-w-full ${
            resolvedTotalWidthUnits && !isAdaptiveCompact ? "table-fixed" : ""
          } ${className ?? ""}`}
        >
          {caption && <caption className="sr-only">{caption}</caption>}
          {resolvedTotalWidthUnits && !isAdaptiveCompact && (
            <colgroup>
              {header.map((item, index) => (
                <col key={index} width={getColumnWidth(item.widthUnits)} />
              ))}
            </colgroup>
          )}
          <thead className="border-b border-border-default">
            <tr className={HEADER_DENSITY_CLASSES[density].row}>
              {header.map((item, index) => {
                const canOpenFilter = hasFilterEnabled(item);
                const headerIcon = getHeaderIcon(item);

                return (
                  <th
                    scope="col"
                    aria-sort={getSortDirection(item)}
                    key={index}
                    ref={(element) => {
                      headerCellRefs.current[index] = element;
                    }}
                    className={`${
                      stickyHeader ? "sticky top-0 z-[1]" : "relative"
                    } ${HEADER_VARIANT_CLASSES[headerVariant]} ${HEADER_DENSITY_CLASSES[density].cell} text-left text-md font-bold ${item.className ?? ""}`}
                    data-has-filter={canOpenFilter}
                  >
                    {canOpenFilter ? (
                      <button
                        type="button"
                      aria-expanded={openFilter === index}
                        aria-controls={
                          openFilter === index
                            ? `${tableId}-filter-${index}`
                            : undefined
                        }
                        ref={(element) => {
                          filterTriggerRefs.current[index] = element;
                        }}
                        aria-label={`Filtrar ou ordenar por ${item.title}`}
                        className={`flex min-h-11 w-full items-center gap-1.5 rounded-sm text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${headerFocusClass} ${
                          item.className?.includes("text-right")
                            ? "justify-end"
                            : ""
                        }`}
                        onClick={() => handleHeaderAction(item, index)}
                      >
                        <span className="min-w-0 truncate">{item.title}</span>
                        {headerIcon && (
                          <span className="flex-shrink-0" aria-hidden="true">
                            {headerIcon}
                          </span>
                        )}
                      </button>
                    ) : (
                      <span
                        className={`flex items-center gap-1.5 ${
                          item.className?.includes("text-right")
                            ? "justify-end"
                            : ""
                        }`}
                      >
                        <span className="min-w-0 truncate">{item.title}</span>
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          {children ? (
            children
          ) : (
            <tbody>
              <tr>
                <td colSpan={header.length}>
                  <NotFound />
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      {openFilter !== null && filterCoords && header[openFilter]?.filters && (
        <div ref={filterRef} className="absolute z-popover">
          <Filter
            id={`${tableId}-filter-${openFilter}`}
            accessibleName={`Filtros da coluna ${header[openFilter].title}`}
            groupName={`${tableId}-${openFilter}`}
            optionChecked={header[openFilter].filters!.optionChecked}
            optionList={header[openFilter].filters!.optionList}
            controls={header[openFilter].filters!.controls}
            onChange={(value) => {
              handleFilterChange(header[openFilter], value);
              closeFilterAndRestoreFocus();
            }}
            onControlChange={(control, value) => {
              handleFilterChange(header[openFilter], value, control);
              if (control.type !== "search") closeFilterAndRestoreFocus();
            }}
            maxHeight={filterMaxHeight}
          />
        </div>
      )}
      {showPagination && pagination && (
        <div className="flex flex-col tablet:flex-row items-end tablet:items-center justify-between mt-6 gap-2 tablet:gap-4">
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="text-sm text-content-primary"
          >
            Visualizando de {pagination.startItem} até {pagination.endItem} de{" "}
            {pagination.totalItems} resultados
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={pagination.onPrevious}
              disabled={pagination.currentPage === 1}
              aria-label="Ir para a página anterior"
              className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded border border-border-default px-2 text-sm leading-none text-content-primary hover:border-border-strong disabled:cursor-not-allowed disabled:border-border-default disabled:opacity-50 ${
                paginationVariant === "arrows" ? "min-w-6 tablet:min-w-7" : ""
              }`}
            >
              <MdKeyboardArrowLeft className="h-3 w-3 text-content-muted" />
              {paginationVariant !== "arrows" && "Anterior"}
            </button>

            <div
              aria-live="polite"
              aria-atomic="true"
              className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-selection-border bg-selection-background px-1.5 text-sm font-bold leading-none text-selection-content tablet:h-7 tablet:min-w-7"
            >
              {pagination.currentPage}
            </div>

            <button
              type="button"
              onClick={pagination.onNext}
              disabled={pagination.currentPage === pagination.totalPages}
              aria-label="Ir para a próxima página"
                className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded border border-border-default px-2 text-sm leading-none text-content-primary hover:border-border-strong disabled:cursor-not-allowed disabled:border-border-default disabled:opacity-50 ${
                paginationVariant === "arrows" ? "min-w-6 tablet:min-w-7" : ""
              }`}
            >
              {paginationVariant !== "arrows" && "Próxima"}
              <MdKeyboardArrowRight className="h-3 w-3 text-content-muted" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableView;
