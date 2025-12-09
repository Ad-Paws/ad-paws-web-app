import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useFormField } from "./FormField";

interface FormCheckboxProps {
  className?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const FormCheckbox = React.forwardRef<HTMLButtonElement, FormCheckboxProps>(
  ({ className, checked, onCheckedChange, disabled }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
      <Checkbox
        ref={ref}
        id={formItemId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-describedby={
          !error
            ? `${formDescriptionId}`
            : `${formDescriptionId} ${formMessageId}`
        }
        aria-invalid={!!error}
        className={cn(className)}
      />
    );
  }
);

FormCheckbox.displayName = "FormCheckbox";

