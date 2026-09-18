import React, { ReactNode } from "react";
import Surface from "../surface";

export type ModalCardProps = {
  children?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function ModalCardView(props: ModalCardProps) {
  const { children, className, ...rest } = props;
  return (
    <Surface
      className={`gap-2 ${className ?? ""}`}
      {...rest}
    >
      {children}
    </Surface>
  );
}

export default ModalCardView;

