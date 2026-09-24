export type PaginationSize = "normal" | "small";
export type PaginationVariant = "default" | "arrows";

export const PAGINATION_SIZE_CLASSES = {
  normal: {
    itemHeight: "box-border h-7 min-h-7",
    pageWidth: "w-8",
    controlPadding: "px-2",
    text: "text-sm",
    gap: "gap-1.5",
  },
  small: {
    itemHeight: "box-border h-6 min-h-6",
    pageWidth: "w-6",
    controlPadding: "px-1.5",
    text: "text-xs",
    gap: "gap-1",
  },
} as const satisfies Record<
  PaginationSize,
  {
    itemHeight: string;
    pageWidth: string;
    controlPadding: string;
    text: string;
    gap: string;
  }
>;

/** Shared normal-size geometry for consumers that do not expose a size prop. */
export const PAGINATION_ITEM_HEIGHT_CLASS =
  PAGINATION_SIZE_CLASSES.normal.itemHeight;
