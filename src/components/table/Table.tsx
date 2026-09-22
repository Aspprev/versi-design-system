"use client";

import React, { ReactNode, useEffect, useId, useMemo, useState } from "react";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import TableView from "./TableView";
import { IFilterControl, IFilterProps } from "./components/filter/Filter";

type TablePrimitive = string | number | null | undefined;

export interface ITableColumnConfig<TData = unknown> {
  key: string;
  title: string;
  className?: string;
  cellClassName?: string;
  widthUnits?: number;
  renderCell?: (item: TData, index: number) => ReactNode;
  accessor?: (item: TData) => TablePrimitive;
  searchAccessor?: (item: TData) => string;
  sortAccessor?: (item: TData) => string | number;
  filterAccessor?: (item: TData) => TablePrimitive;
  filters?: {
    controls: IFilterControl[];
    matchOption?: (
      item: TData,
      value: string,
      control: IFilterControl,
    ) => boolean;
    matchSearch?: (
      item: TData,
      value: string,
      control: IFilterControl,
    ) => boolean;
    compare?: (
      a: TData,
      b: TData,
      value: string,
      control: IFilterControl,
    ) => number;
  };
}

export interface IHeaderItem<TData = unknown> {
  title: string;
  onClick?: () => void;
  isFilterOpen?: boolean;
  filters?: IFilterProps;
  className?: string;
  key?: string;
  cellClassName?: string;
  widthUnits?: number;
  renderCell?: (item: TData, index: number) => ReactNode;
}

export interface ITablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startItem: number;
  endItem: number;
  onPrevious: () => void;
  onNext: () => void;
  variant?: "default" | "arrows";
}

export interface ITableExpandableConfig<TData = unknown> {
  getRowId: (item: TData, index: number) => string | number;
  expandedRowId: string | number | null;
  onToggleRow: (rowId: string | number, item: TData, index: number) => void;
  renderExpandedRow: (item: TData, index: number) => ReactNode;
  expandedRowClassName?: string;
  expandedContentClassName?: string;
  rowClassName?: (item: TData, isExpanded: boolean) => string | undefined;
}

export type TableOverflowMode = "fit" | "adaptive" | "scroll";
export type TableRowVariant = "plain" | "striped";
export type TableHeaderVariant = "default" | "brand" | "dark" | "neutral";
export type TableDensity = "comfortable" | "compact";

export interface TableProps<TData = unknown>
  extends React.HTMLAttributes<HTMLDivElement> {
  header: IHeaderItem<TData>[] | ITableColumnConfig<TData>[];
  accessibleName?: string;
  caption?: ReactNode;
  children?: ReactNode;
  onFilterChange?: (value: string) => void;
  showPagination?: boolean;
  pagination?: ITablePaginationProps;
  data?: TData[];
  itemsPerPage?: number;
  emptyMessage?: string;
  errorMessage?: ReactNode;
  totalWidthUnits?: number;
  showRowDivider?: boolean;
  enableRowHover?: boolean;
  paginationVariant?: "default" | "arrows";
  expandable?: ITableExpandableConfig<TData>;
  overflowMode?: TableOverflowMode;
  adaptiveBreakpoint?: number;
  stickyHeader?: boolean;
  scrollAreaMaxHeight?: React.CSSProperties["maxHeight"];
  rowVariant?: TableRowVariant;
  headerVariant?: TableHeaderVariant;
  density?: TableDensity;
}

function Table<TData = unknown>(props: TableProps<TData>) {
  const {
    children,
    header,
    accessibleName,
    caption,
    className,
    onFilterChange,
    showPagination = false,
    pagination,
    data,
    itemsPerPage = 10,
    emptyMessage = "Nenhum item encontrado",
    errorMessage,
    totalWidthUnits,
    showRowDivider = false,
    enableRowHover = false,
    paginationVariant = "default",
    expandable,
    overflowMode,
    adaptiveBreakpoint,
    stickyHeader = false,
    scrollAreaMaxHeight,
    rowVariant = "plain",
    headerVariant = "default",
    density = "comfortable",
  } = props;
  const breakpoint = useBreakpoint();
  const tableId = useId();
  const isMobile = breakpoint === "mobile";
  const resolvedOverflowMode = overflowMode ?? (data ? "adaptive" : "scroll");
  const resolvedAdaptiveBreakpoint =
    adaptiveBreakpoint ??
    Math.min(920, 320 + Math.max(header.length - 2, 0) * 120);

  const [currentPage, setCurrentPage] = useState(1);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [visibleExpandedRowId, setVisibleExpandedRowId] = useState<
    string | null
  >(() =>
    expandable?.expandedRowId !== null &&
    expandable?.expandedRowId !== undefined
      ? String(expandable.expandedRowId)
      : null,
  );
  const [closingExpandedRowId, setClosingExpandedRowId] = useState<
    string | null
  >(null);

  const normalizedHeader = useMemo(() => {
    return header.map((item) => {
      const typedItem = item as ITableColumnConfig<TData>;
      return {
        ...typedItem,
        title: typedItem.title,
      };
    });
  }, [header]);

  const controlledHeader = useMemo(() => {
    if (!data) {
      return normalizedHeader as IHeaderItem<TData>[];
    }

    return normalizedHeader.map((item, columnIndex) => {
      const controls = item.filters?.controls?.map((control) => ({
        ...control,
        value:
          filterValues[`${item.key}-${control.id}`] ??
          control.value ??
          (control.type === "search" ? "" : "__all__"),
      }));

      return {
        ...item,
        filters: controls?.length
          ? {
              controls,
            }
          : undefined,
      };
    }) as IHeaderItem<TData>[];
  }, [data, filterValues, normalizedHeader]);

  const filteredAndSortedData = useMemo(() => {
    if (!data) return [];

    let result = [...data];
    const sorters: Array<(a: TData, b: TData) => number> = [];

    normalizedHeader.forEach((column) => {
      const controls = column.filters?.controls ?? [];

      controls.forEach((control) => {
        const stateKey = `${column.key}-${control.id}`;
        const value =
          filterValues[stateKey] ??
          control.value ??
          (control.type === "search" ? "" : "__all__");

        if (!value || value === "__all__") {
          return;
        }

        if (control.type === "options") {
          result = result.filter((item) => {
            if (column.filters?.matchOption) {
              return column.filters.matchOption(item, value, control);
            }

            const resolvedValue =
              column.filterAccessor?.(item) ?? column.accessor?.(item);
            return String(resolvedValue ?? "") === value;
          });
          return;
        }

        if (control.type === "search") {
          const normalizedSearch = value.toLowerCase().trim();
          result = result.filter((item) => {
            if (column.filters?.matchSearch) {
              return column.filters.matchSearch(item, value, control);
            }

            const searchableValue =
              column.searchAccessor?.(item) ??
              String(
                column.filterAccessor?.(item) ?? column.accessor?.(item) ?? "",
              );

            return searchableValue.toLowerCase().includes(normalizedSearch);
          });
          return;
        }

        if (control.type === "sort") {
          sorters.push((a, b) => {
            if (column.filters?.compare) {
              return column.filters.compare(a, b, value, control);
            }

            const valueA = column.sortAccessor?.(a) ?? column.accessor?.(a);
            const valueB = column.sortAccessor?.(b) ?? column.accessor?.(b);

            if (typeof valueA === "number" && typeof valueB === "number") {
              return value === "desc" ? valueB - valueA : valueA - valueB;
            }

            const stringA = String(valueA ?? "");
            const stringB = String(valueB ?? "");
            return value === "desc"
              ? stringB.localeCompare(stringA)
              : stringA.localeCompare(stringB);
          });
        }
      });
    });

    if (!sorters.length) {
      return result;
    }

    return [...result].sort((a, b) => {
      for (const sorter of sorters) {
        const comparison = sorter(a, b);
        if (comparison !== 0) {
          return comparison;
        }
      }

      return 0;
    });
  }, [data, filterValues, normalizedHeader]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterValues]);

  useEffect(() => {
    if (!expandable) {
      setVisibleExpandedRowId(null);
      setClosingExpandedRowId(null);
      return;
    }

    const nextExpandedRowId =
      expandable.expandedRowId !== null &&
      expandable.expandedRowId !== undefined
        ? String(expandable.expandedRowId)
        : null;

    if (nextExpandedRowId) {
      setVisibleExpandedRowId(nextExpandedRowId);
      setClosingExpandedRowId(null);
      return;
    }

    if (!visibleExpandedRowId) {
      return;
    }

    setClosingExpandedRowId(visibleExpandedRowId);
    const timeoutId = window.setTimeout(() => {
      setVisibleExpandedRowId(null);
      setClosingExpandedRowId(null);
    }, 220);

    return () => window.clearTimeout(timeoutId);
  }, [expandable, visibleExpandedRowId]);

  const internalPagination = useMemo(() => {
    if (!data) return null;

    const totalItems = filteredAndSortedData.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return {
      currentPage: safeCurrentPage,
      totalPages,
      totalItems,
      startItem: totalItems === 0 ? 0 : startIndex + 1,
      endItem: Math.min(endIndex, totalItems),
      pageData: filteredAndSortedData.slice(startIndex, endIndex),
    };
  }, [currentPage, data, filteredAndSortedData, itemsPerPage]);

  const managedCellClassName =
    density === "compact"
      ? "px-3 py-1.5 text-sm text-content-primary"
      : "px-4 py-2 text-sm text-content-primary";
  const expandedContentClassName =
    density === "compact"
      ? "bg-surface-card px-3 py-3"
      : "bg-surface-card px-4 py-4";
  const emptyCellClassName =
    density === "compact"
      ? "px-3 py-4 text-center text-sm text-content-muted"
      : "px-4 py-6 text-center text-sm text-content-muted";

  const renderedChildren = useMemo(() => {
    if (!data || !internalPagination) {
      return children;
    }

    return (
      <tbody data-managed-rows="true">
        {internalPagination.pageData.map((item, index) =>
          (() => {
            const rowId = expandable?.getRowId(item, index);
            const normalizedRowId =
              rowId !== undefined ? String(rowId) : undefined;
            const isExpanded =
              normalizedRowId !== undefined &&
              expandable?.expandedRowId !== null &&
              expandable?.expandedRowId !== undefined &&
              String(expandable.expandedRowId) === normalizedRowId;
            const isVisibleExpandedRow =
              normalizedRowId !== undefined &&
              visibleExpandedRowId === normalizedRowId;
            const isClosingExpandedRow =
              normalizedRowId !== undefined &&
              closingExpandedRowId === normalizedRowId;
            const rowNumber = internalPagination.startItem + index;
            const rowContentIds = normalizedHeader.map(
              (_, columnIndex) =>
                `${tableId}-row-${rowNumber}-cell-${columnIndex + 1}`,
            );
            const expandedContentId = `${tableId}-row-${rowNumber}-details-content`;

            return (
              <React.Fragment
                key={`row-group-${normalizedRowId ?? `${index}-${JSON.stringify(item)}`}`}
              >
                <tr
                  tabIndex={0}
                  aria-label={`Linha ${rowNumber} de ${internalPagination.totalItems}`}
                  aria-describedby={rowContentIds.join(" ")}
                  data-table-row-stripe={
                    rowVariant === "striped" && index % 2 === 1 && !isExpanded
                      ? "true"
                      : undefined
                  }
                  className={[
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring",
                    showRowDivider ? "border-b border-border-default" : "",
                    enableRowHover ? "hover:bg-primary-5" : "",
                    expandable?.rowClassName?.(item, Boolean(isExpanded)) ?? "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {normalizedHeader.map((column, columnIndex) => (
                    <td
                      key={column.key}
                      id={rowContentIds[columnIndex]}
                      data-label={column.title}
                      className={
                        column.cellClassName ?? managedCellClassName
                      }
                    >
                      {column.renderCell
                        ? column.renderCell(item, index)
                        : String(column.accessor?.(item) ?? "-")}
                    </td>
                  ))}
                </tr>
                {isVisibleExpandedRow && expandable && (
                  <tr className={expandable?.expandedRowClassName}>
                    <td
                      colSpan={normalizedHeader.length}
                      className={
                        expandable?.expandedContentClassName ??
                        expandedContentClassName
                      }
                    >
                      <div
                        role="region"
                        tabIndex={isExpanded && !isClosingExpandedRow ? 0 : -1}
                        aria-label={`Detalhes da linha ${rowNumber}`}
                        aria-describedby={expandedContentId}
                        aria-hidden={
                          !isExpanded || isClosingExpandedRow || undefined
                        }
                        className={`overflow-hidden transition-all duration-200 ease-out ${
                          isExpanded && !isClosingExpandedRow
                            ? "max-h-[1200px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div id={expandedContentId}>
                          {expandable.renderExpandedRow(item, index)}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })(),
        )}
        {internalPagination.pageData.length === 0 && (
          <tr>
            <td
              colSpan={normalizedHeader.length}
              className={emptyCellClassName}
            >
              {errorMessage ? (
                <span role="alert">{errorMessage}</span>
              ) : (
                <span role="status">{emptyMessage}</span>
              )}
            </td>
          </tr>
        )}
      </tbody>
    );
  }, [
    children,
    data,
    emptyMessage,
    errorMessage,
    emptyCellClassName,
    enableRowHover,
    expandable,
    expandedContentClassName,
    internalPagination,
    managedCellClassName,
    normalizedHeader,
    rowVariant,
    showRowDivider,
    tableId,
    visibleExpandedRowId,
    closingExpandedRowId,
  ]);

  const resolvedPagination = data
    ? internalPagination && {
        currentPage: internalPagination.currentPage,
        totalPages: internalPagination.totalPages,
        totalItems: internalPagination.totalItems,
        startItem: internalPagination.startItem,
        endItem: internalPagination.endItem,
        variant: isMobile ? "arrows" : paginationVariant,
        onPrevious: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
        onNext: () =>
          setCurrentPage((prev) =>
            Math.min(prev + 1, internalPagination.totalPages),
          ),
      }
    : pagination
      ? {
          ...pagination,
          variant: isMobile ? "arrows" : (pagination.variant ?? "default"),
        }
      : pagination;

  const resolvedShowPagination = data
    ? Boolean(
        internalPagination && internalPagination.totalItems > itemsPerPage,
      )
    : showPagination;

  const handleInternalFilterChange = (
    columnKey: string,
    controlId: string,
    value: string,
  ) => {
    setFilterValues((prev) => ({
      ...prev,
      [`${columnKey}-${controlId}`]: value,
    }));
  };

  const resolvedHeader = data
    ? controlledHeader.map((item) => ({
        ...item,
        filters: item.filters?.controls?.length
          ? {
              controls: item.filters.controls,
              onControlChange: (control: IFilterControl, value: string) =>
                handleInternalFilterChange(
                  item.key ?? item.title,
                  control.id,
                  value,
                ),
            }
          : undefined,
      }))
    : controlledHeader;

  return (
    <TableView<TData>
      header={resolvedHeader}
      accessibleName={accessibleName}
      caption={caption}
      onFilterChange={onFilterChange}
      className={className}
      showPagination={resolvedShowPagination}
      pagination={resolvedPagination ?? undefined}
      totalWidthUnits={totalWidthUnits}
      overflowMode={resolvedOverflowMode}
      adaptiveBreakpoint={resolvedAdaptiveBreakpoint}
      stickyHeader={stickyHeader}
      scrollAreaMaxHeight={scrollAreaMaxHeight}
      rowVariant={rowVariant}
      headerVariant={headerVariant}
      density={density}
    >
      {renderedChildren}
    </TableView>
  );
}

export default Table;
