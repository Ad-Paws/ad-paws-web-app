import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  evaluatePassword,
  type PasswordStrength,
} from "@/lib/passwordPolicy";
import { useFormField } from "./FormField";

const STRENGTH_UI: Record<
  Exclude<PasswordStrength, "none">,
  { label: string; segments: number; bar: string; text: string }
> = {
  weak: {
    label: "Débil",
    segments: 1,
    bar: "bg-destructive",
    text: "text-badge-danger-foreground",
  },
  medium: {
    label: "Media",
    segments: 2,
    bar: "bg-accent",
    text: "text-badge-warning-foreground",
  },
  strong: {
    label: "Segura",
    segments: 3,
    bar: "bg-primary",
    text: "text-badge-success-foreground",
  },
};

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

/**
 * Semáforo de seguridad + checklist de requisitos. Va dentro de un
 * `FormItem`: toma el id de descripción del campo para que el input lo
 * anuncie vía `aria-describedby` (lo pone `FormControl`).
 */
export function PasswordStrengthMeter({
  password,
  className,
}: PasswordStrengthMeterProps) {
  const { formDescriptionId } = useFormField();
  const { rules, strength } = evaluatePassword(password);
  const ui = strength === "none" ? null : STRENGTH_UI[strength];

  return (
    <div
      id={formDescriptionId}
      className={cn("-mt-1 flex flex-col gap-2", className)}
      data-strength={strength}
    >
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full bg-border transition-colors duration-200",
                ui && i < ui.segments && ui.bar,
              )}
            />
          ))}
        </div>
        <p
          className={cn(
            "h-4 min-w-14 text-right text-xs leading-4 font-semibold",
            ui?.text ?? "text-muted-foreground",
          )}
          aria-live="polite"
        >
          {ui ? ui.label : ""}
          {ui && <span className="sr-only"> — seguridad de la contraseña</span>}
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
        {rules.map(({ rule, passed }) => (
          <li
            key={rule.id}
            className={cn(
              "flex items-center gap-1.5 text-xs transition-colors",
              passed
                ? "text-badge-success-foreground"
                : "text-muted-foreground",
            )}
          >
            {passed ? (
              <Check className="size-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <Circle className="size-3.5 shrink-0" aria-hidden="true" />
            )}
            <span>
              {rule.label}
              <span className="sr-only">
                {passed ? " (cumplido)" : " (pendiente)"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
