"use client";

import { ReactNode, useEffect, useId, useMemo, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export interface IMobileCardTableHeader {
  label: string;
  className?: string;
}

export interface IMobileCardTableExpandableConfig<TData> {
  getRowId: (item: TData, index: number) => string | number;
  expandedRowId: string | number | null;
  onToggleRow: (rowId: string | number, item: TData, index: number) => void;
  renderExpandedRow: (item: TData, index: number) => ReactNode;
  expandedContentClassName?: string;
  rowClassName?: (item: TData, isExpanded: boolean) => string | undefined;
}

export interface MobileCardTableProps<TData> {
  headers: IMobileCardTableHeader[];
  accessibleName?: string;
  data: TData[] | null | undefined | false;
  renderCard: (item: TData, index: number) => ReactNode;
  keyExtractor: (item: TData, index: number) => string;
  itemsPerPage?: number;
  emptyMessage?: string;
  wrapperClassName?: string;
  headerClassName?: string;
  emptyClassName?: string;
  showPagination?: boolean;
  expandable?: IMobileCardTableExpandableConfig<TData>;
}

function MobileCardTable<TData>({
  headers,
  accessibleName,
  data,
  renderCard,
  keyExtractor,
  itemsPerPage = 10,
  emptyMessage = "Nenhum item encontrado.",
  wrapperClassName = "",
  headerClassName = "",
  emptyClassName = "",
  showPagination = true,
  expandable,
}: MobileCardTableProps<TData>) {
  const listId = useId();
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleExpandedRowId, setVisibleExpandedRowId] = useState<string | null>(
    () =>
      expandable?.expandedRowId !== null &&
      expandable?.expandedRowId !== undefined
        ? String(expandable.expandedRowId)
        : null,
  );
  const [closingExpandedRowId, setClosingExpandedRowId] = useState<string | null>(
    null,
  );

  const normalizedData = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data],
  );
  const safeItemsPerPage = Number.isFinite(itemsPerPage)
    ? Math.max(1, Math.floor(itemsPerPage))
    : 10;

  const pagination = useMemo(() => {
    const totalItems = normalizedData.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / safeItemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * safeItemsPerPage;
    const endIndex = startIndex + safeItemsPerPage;

    return {
      currentPage: safeCurrentPage,
      totalPages,
      totalItems,
      startItem: totalItems === 0 ? 0 : startIndex + 1,
      endItem: Math.min(endIndex, totalItems),
      pageData: normalizedData.slice(startIndex, endIndex),
    };
  }, [currentPage, normalizedData, safeItemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [normalizedData]);

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

  return (
    <>
      <div
        role="region"
        aria-label={
          accessibleName ??
          `Lista: ${headers.map((header) => header.label).join(", ")}`
        }
        className={`overflow-hidden rounded-sm border border-border-default bg-surface-card ${wrapperClassName}`.trim()}
      >
        <div
          className={`border-b border-border-default bg-surface-card px-3 py-2 text-left text-xs font-bold tracking-wider text-content-secondary ${headerClassName}`.trim()}
        >
          {headers.map((header) => (
            <span key={header.label} className={header.className}>
              {header.label}
            </span>
          ))}
        </div>

        {pagination.totalItems > 0 ? (
          <div role="list" aria-label="Itens da lista">
            {pagination.pageData.map((item, index) => (
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
              const itemNumber = pagination.startItem + index;
              const cardContentId = `${listId}-item-${itemNumber}-content`;
              const expandedContentId = `${listId}-item-${itemNumber}-details-content`;

              return (
                <div
                  key={keyExtractor(item, index)}
                  role="listitem"
                  aria-label={`Item ${itemNumber} de ${pagination.totalItems}`}
                  aria-describedby={cardContentId}
                  className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring"
                >
                  <div
                    id={cardContentId}
                    className={expandable?.rowClassName?.(item, Boolean(isExpanded))}
                  >
                    {renderCard(item, index)}
                  </div>
                  {expandable && isVisibleExpandedRow && (
                    <div
                      className={
                        expandable.expandedContentClassName ??
                        "border-b border-border-default bg-surface-card px-3 py-4"
                      }
                    >
                      <div
                        role="region"
                        tabIndex={isExpanded && !isClosingExpandedRow ? 0 : -1}
                        aria-label={`Detalhes do item ${itemNumber}`}
                        aria-describedby={expandedContentId}
                        aria-hidden={
                          !isExpanded || isClosingExpandedRow || undefined
                        }
                        className={`overflow-hidden transition-all duration-200 ease-out motion-reduce:transition-none ${
                          isExpanded && !isClosingExpandedRow
                            ? "max-h-[1200px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div id={expandedContentId}>
                          {expandable.renderExpandedRow(item, index)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
            ))}
          </div>
        ) : (
          <div
            role="status"
            className={`px-3 py-4 text-center text-md text-content-secondary ${emptyClassName}`.trim()}
          >
            {emptyMessage}
          </div>
        )}
      </div>

      {showPagination && pagination.totalItems > safeItemsPerPage && (
        <div className="mt-4 flex flex-col items-center justify-center gap-3 text-center">
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="text-sm text-content-primary"
          >
            Visualizando de {pagination.startItem} até {pagination.endItem} de{" "}
            {pagination.totalItems} resultados
          </p>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={pagination.currentPage === 1}
              aria-label="Ir para a página anterior"
              className="inline-flex h-7 items-center justify-center gap-1 rounded border border-border-default px-3 text-sm leading-none text-content-primary hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MdKeyboardArrowLeft className="h-3 w-3 text-content-muted" />
              Anterior
            </button>

            <div
              aria-live="polite"
              aria-atomic="true"
              className="inline-flex h-7 min-w-7 items-center justify-center rounded border border-selection-border bg-selection-background px-2 text-sm font-bold leading-none text-selection-content"
            >
              {pagination.currentPage}
            </div>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, pagination.totalPages),
                )
              }
              disabled={pagination.currentPage === pagination.totalPages}
              aria-label="Ir para a próxima página"
              className="inline-flex h-7 items-center justify-center gap-1 rounded border border-border-default px-3 text-sm leading-none text-content-primary hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-50"
            >
              Próximo
              <MdKeyboardArrowRight className="h-3 w-3 text-content-muted" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default MobileCardTable;
