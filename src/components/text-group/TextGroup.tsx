import Typography from "../typography/typography";
import type { HTMLAttributes } from "react";

export type TextGroupProps = {
  title: string;
  text: string;
} & HTMLAttributes<HTMLDivElement>;

export default function TextGroup({
  title,
  text = "-",
  className,
  ...rest
}: TextGroupProps) {
  return (
    <div className={className} {...rest}>
      <Typography size="sm" className="text-content-primary">
        {title}
      </Typography>
      <Typography size="md" className="break-words font-semibold text-content-primary">
        {text || "-"}
      </Typography>
    </div>
  );
}


