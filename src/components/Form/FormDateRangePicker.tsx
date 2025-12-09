import * as React from "react";
import { format, type Locale } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFormField } from "./FormField";
import { cn } from "@/lib/utils";

export interface DateRangeValue {
  from: Date | undefined;
  to: Date | undefined;
}

interface FormDateRangePickerProps {
  placeholder?: string;
  placeholderTo?: string;
  className?: string;
  disabled?: boolean;
  value?: DateRangeValue;
  onChange?: (range: DateRangeValue | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
  locale?: Locale;
  numberOfMonths?: number;
}

export const FormDateRangePicker = React.forwardRef<
  HTMLButtonElement,
  FormDateRangePickerProps
>(
  (
    {
      placeholder = "Selecciona un rango de fechas",
      placeholderTo = "Fecha fin",
      className,
      disabled,
      value,
      onChange,
      minDate,
      maxDate,
      dateFormat = "dd MMM",
      locale = es,
      numberOfMonths = 2,
    },
    ref
  ) => {
    const { error, formItemId, formDescriptionId, formMessageId } =
      useFormField();
    const [open, setOpen] = React.useState(false);

    const handleSelect = (range: DateRange | undefined) => {
      // If from and to are the same date, user just selected the start date
      // Keep to as undefined to wait for the end date selection
      if (
        range?.from &&
        range?.to &&
        range.from.getTime() === range.to.getTime()
      ) {
        onChange?.({
          from: range.from,
          to: undefined,
        });
        return;
      }

      onChange?.({
        from: range?.from,
        to: range?.to,
      });
    };

    // Close popover only when both dates are selected
    React.useEffect(() => {
      if (value?.from && value?.to) {
        setOpen(false);
      }
    }, [value?.from, value?.to]);

    const formatDateRange = () => {
      if (!value?.from && !value?.to) {
        return null;
      }

      if (value.from && value.to) {
        return `${format(value.from, dateFormat, { locale })} - ${format(
          value.to,
          dateFormat,
          { locale }
        )}`;
      }

      if (value.from) {
        return `${format(value.from, dateFormat, {
          locale,
        })} - ${placeholderTo}`;
      }

      return null;
    };

    const displayValue = formatDateRange();

    const handleOpenChange = (isOpen: boolean) => {
      // Prevent closing if we only have the start date selected (waiting for end date)
      if (!isOpen && value?.from && !value?.to) {
        return;
      }
      setOpen(isOpen);
    };

    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
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
              !displayValue && "text-[#9CA3AF]",
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
            mode="range"
            selected={{
              from: value?.from,
              to: value?.to,
            }}
            onSelect={handleSelect}
            numberOfMonths={numberOfMonths}
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

FormDateRangePicker.displayName = "FormDateRangePicker";
