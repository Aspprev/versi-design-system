import type { IconType } from "react-icons";

export type PreferenceSectionProps = {
  title: string;
  description: string;
  icon: IconType;
  children: React.ReactNode;
  className?: string;
};

export default function PreferenceSection({
  title,
  description,
  icon: Icon,
  children,
  className,
}: PreferenceSectionProps) {
  return (
    <fieldset
      className={`rounded-md border border-border-default bg-surface-subtle p-4 tablet:p-5 ${className ?? ""}`.trim()}
    >
      <legend className="sr-only">{title}</legend>
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-5 text-primary-1">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-content-secondary">{description}</p>
        </div>
      </div>
      {children}
    </fieldset>
  );
}
