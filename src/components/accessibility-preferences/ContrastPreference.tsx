import { MdContrast } from "react-icons/md";
import InputSwitch from "../InputSwitch/InputSwitch";
import PreferenceSection from "./PreferenceSection";

export type ContrastPreferenceProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

export default function ContrastPreference({
  checked,
  onChange,
  className,
}: ContrastPreferenceProps) {
  return (
    <PreferenceSection
      title="Contraste"
      description="Aumente a diferenciação entre conteúdo e superfície."
      icon={MdContrast}
      className={className}
    >
      <div className="flex min-h-16 items-center justify-between gap-4 rounded-sm border border-border-default bg-surface-card px-3 py-3">
        <span className="flex items-center gap-1.5 font-semibold">
          <MdContrast aria-hidden="true" className="h-4 w-4" />
          Alto contraste
        </span>
        <InputSwitch
          aria-label="Alternar alto contraste"
          checked={checked}
          size="lg"
          onChange={onChange}
        />
      </div>
    </PreferenceSection>
  );
}
