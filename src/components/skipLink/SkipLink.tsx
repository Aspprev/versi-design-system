import classNames from "classnames";

export interface SkipLinkProps {
  targetId?: string;
  label?: string;
  className?: string;
}

export default function SkipLink({
  targetId = "main-content",
  label = "Pular para o conteúdo",
  className,
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={classNames(
        "fixed left-2 top-0 z-drawer -translate-y-[calc(100%+0.5rem)] whitespace-nowrap rounded-sm border border-border-default bg-surface-card px-3 py-2 font-bold text-content-primary shadow-md transition-transform focus:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring motion-reduce:transition-none",
        className,
      )}
    >
      {label}
    </a>
  );
}
