import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import type { LucideIcon } from "lucide-react";

export type ServiceItemVariant = "blue" | "green" | "orange" | "red";

export interface AdditionalServiceItemProps {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  price: string;
  variant?: ServiceItemVariant;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

const variantStyles: Record<ServiceItemVariant, { bg: string; icon: string }> = {
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    icon: "text-blue-600 dark:text-blue-400",
  },
  green: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    icon: "text-orange-600 dark:text-orange-400",
  },
  red: {
    bg: "bg-red-100 dark:bg-red-900/30",
    icon: "text-red-600 dark:text-red-400",
  },
};

export function AdditionalServiceItem({
  id,
  icon: Icon,
  title,
  description,
  price,
  variant = "blue",
  checked = false,
  onCheckedChange,
  className,
}: AdditionalServiceItemProps) {
  const styles = variantStyles[variant];

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center gap-4 py-3 cursor-pointer group",
        className
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <div className={cn("rounded-lg p-2", styles.bg)}>
        <Icon className={cn("size-4", styles.icon)} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
        +{price}
      </span>
    </label>
  );
}

