/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { useFormContext } from "./FormContext";
import { Field } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

/**
 * Id compartido por todo lo que vive dentro de un `FormItem` (label, control,
 * descripción, mensaje). Sin esto cada componente generaba su propio
 * `useId()` y `htmlFor` / `aria-describedby` apuntaban a ids inexistentes.
 */
const FormItemContext = React.createContext<{ id: string } | null>(null);

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const formContext = useFormContext();
  const fallbackId = React.useId();

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const fieldState = formContext.getFieldState(
    fieldContext.name,
    formContext.formState
  );

  // Fuera de un FormItem (uso suelto) se conserva el comportamiento anterior.
  const id = itemContext?.id ?? fallbackId;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  const form = useFormContext<TFieldValues>();

  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller control={form.control} {...props} />
    </FormFieldContext.Provider>
  );
};

export const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();
  const { invalid } = useFormField();

  return (
    <FormItemContext.Provider value={{ id }}>
      <Field
        ref={ref}
        data-invalid={invalid}
        className={cn(className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";
