import React from "react";
import classNames from "classnames";

const colorClassMap = {
  light: "bg-border-subtle",
  dark: "bg-border-strong",
  black: "bg-content-primary",
};

export type DividerProps = {
  width?: string;
  height?: string;
  bgColor?: "light" | "dark" | "black";
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const Divider: React.FC<DividerProps> = ({
  width,
  height = "h-[1px]",
  children,
  bgColor = "black",
  ...rest
}) => {
  const colorClass = colorClassMap[bgColor];
  const barClass = classNames(children ? "w-1/3" : "w-1/2", height, colorClass);

  return (
    <div className={classNames(width, "flex items-center justify-center")}>
      <div className={barClass}></div>
      {children && <div className="px-3">{children} </div>}
      <div className={barClass}></div>
    </div>
  );
};

export default Divider;

