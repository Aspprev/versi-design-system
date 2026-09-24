import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const textVariants = cva("font-nunito", {
  variants: {
    variant: {
      primary: "text-content-primary",
      secondary: "text-content-secondary",
      tertiary: "text-content-muted",
      disabled: "text-content-disabled",
      link: "text-content-link",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-md",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      title1: "text-titlexl",
      title2: "text-titlelg",
      title3: "text-titlemd",
    },
    weight: {
      thin: "font-thin",
      extralight: "font-extralight",
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
      black: "font-black",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    weight: "normal",
  },
});

/**
 * Semantic text roles map to the DS typography tokens. They describe the
 * purpose of the text, while `element` controls the rendered HTML element.
 */
export type TypographySemanticRole =
  | "page-title"
  | "section-title"
  | "body"
  | "label"
  | "caption"
  | "helper";

const semanticRoleDefaults: Record<
  TypographySemanticRole,
  {
    size: NonNullable<VariantProps<typeof textVariants>["size"]>;
    weight: NonNullable<VariantProps<typeof textVariants>["weight"]>;
    variant: NonNullable<VariantProps<typeof textVariants>["variant"]>;
  }
> = {
  "page-title": { size: "2xl", weight: "extrabold", variant: "primary" },
  "section-title": { size: "xl", weight: "extrabold", variant: "primary" },
  body: { size: "md", weight: "normal", variant: "primary" },
  label: { size: "md", weight: "normal", variant: "primary" },
  caption: { size: "sm", weight: "normal", variant: "secondary" },
  helper: { size: "sm", weight: "normal", variant: "tertiary" },
};

type TextElement =
  | "p"
  | "span"
  | "div"
  | "label"
  | "strong"
  | "em"
  | "small"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

export type TypographyProps = VariantProps<typeof textVariants> & {
  children: React.ReactNode;
  /** HTML element used for the content; it is independent from semanticRole. */
  element?: TextElement;
  /** Optional semantic role with token-backed size, weight and color defaults. */
  semanticRole?: TypographySemanticRole;
  /** Additional classes for layout or a consumer-specific presentation need. */
  className?: string;
} & React.HTMLAttributes<HTMLElement>;

export function Typography({
  children,
  element = "p",
  semanticRole,
  className,
  variant,
  size,
  weight,
  ...rest
}: TypographyProps) {
  const Component = element;
  const semanticDefaults = semanticRole
    ? semanticRoleDefaults[semanticRole]
    : undefined;

  return (
    <Component
      className={textVariants({
        variant: variant ?? semanticDefaults?.variant,
        size: size ?? semanticDefaults?.size,
        weight: weight ?? semanticDefaults?.weight,
        className,
      })}
      {...rest}
    >
      {children}
    </Component>
  );
}

export default Typography;

