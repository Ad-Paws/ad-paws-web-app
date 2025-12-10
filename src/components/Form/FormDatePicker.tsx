import * as React from "react";
import { format, type Locale } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFormField } from "./FormField";
import { cn } from "@/lib/utils";

interface FormDatePickerProps {
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
  locale?: Locale;
}

export const FormDatePicker = React.forwardRef<
  HTMLButtonElement,
  FormDatePickerProps
>(
  (
    {
      placeholder = "Selecciona una fecha",
      className,
      disabled,
      value,
      onChange,
      minDate,
      maxDate,
      dateFormat = "PPP",
      locale = es,
    },
    ref
  ) => {
    const { error, formItemId, formDescriptionId, formMessageId } =
      useFormField();
    const [open, setOpen] = React.useState(false);

    const handleSelect = (date: Date | undefined) => {
      onChange?.(date);
      setOpen(false);
    };

    const displayValue = value ? format(value, dateFormat, { locale }) : "";

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            type="button"
            id={formItemId}
            disabled={disabled}
            aria-describedby={
              !error
                ? `${formDescriptionId}`
                : `${formDescriptionId} ${formMessageId}`
            }
            aria-invalid={!!error}
            className={cn(
              // Base input styles
              "flex w-full items-center gap-2 rounded-md border px-3 py-2 text-sm text-left",
              "h-9 min-w-0 shadow-xs transition-[color,box-shadow] outline-none",
              // Colors matching input
              "bg-[#F9FAFB] border-[#F3F4F6]",
              "dark:bg-input/30 dark:border-input",
              // Focus states
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              // Error states
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              // Disabled states
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              // Placeholder color when no value
              !value && "text-[#9CA3AF]",
              // Cursor
              "cursor-pointer",
              className
            )}
          >
            <CalendarIcon className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
            <span className="flex-1 truncate">
              {displayValue || placeholder}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            month={value ? new Date(value) : undefined}
            reverseYears
            mode="single"
            selected={value}
            onSelect={handleSelect}
            captionLayout="dropdown"
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            locale={locale}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  }
);

FormDatePicker.displayName = "FormDatePicker";
