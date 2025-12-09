import * as React from "react";
import { cn } from "@/lib/utils";
import { useFormField } from "./FormField";
import type { LucideIcon } from "lucide-react";

export type ServiceTypeVariant = "green" | "blue" | "amber" | "rose";

export interface FormServiceTypeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: ServiceTypeVariant;
  value: string;
  selectedValue?: string;
  onSelect?: (value: string) => void;
  className?: string;
}

const variantStyles: Record<ServiceTypeVariant, { bg: string; icon: string }> = {
  green: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    icon: "text-blue-600 dark:text-blue-400",
  },
  amber: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    icon: "text-amber-600 dark:text-amber-400",
  },
  rose: {
    bg: "bg-rose-100 dark:bg-rose-900/30",
    icon: "text-rose-600 dark:text-rose-400",
  },
};

export const FormServiceTypeCard = React.forwardRef<HTMLButtonElement, FormServiceTypeCardProps>(
  (
    {
      icon: Icon,
      title,
      description,
      variant = "green",
      value,
      selectedValue,
      onSelect,
      className,
    },
    ref
  ) => {
    const { formItemId } = useFormField();
    const styles = variantStyles[variant];
    const selected = selectedValue === value;

    return (
      <button
        ref={ref}
        type="button"
        id={`${formItemId}-${value}`}
        onClick={() => onSelect?.(value)}
        className={cn(
          "flex flex-col items-start gap-3 rounded-xl border-2 p-4 text-left transition-all hover:shadow-md",
          selected
            ? "border-primary bg-primary/5"
            : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500",
          className
        )}
      >
        <div className={cn("rounded-lg p-2.5", styles.bg)}>
          <Icon className={cn("size-5", styles.icon)} />
        </div>
        <div>
          <h3 className={cn("font-semibold text-sm", selected ? "text-primary" : "text-foreground")}>
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </button>
    );
  }
);

FormServiceTypeCard.displayName = "FormServiceTypeCard";

