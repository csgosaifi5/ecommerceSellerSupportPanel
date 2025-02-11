"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { NumberField } from "../number-input";

function FormNumberInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  description,
  inputClassName,
  children,
  label,
  className,
  ...props
}: {
  label?: string;
  control: Control<TFieldValues>;
  className?: string;
  inputClassName?: string;
  children?: React.ReactNode;
  Icon?: React.ReactNode;
  name: TName;
  description?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className={"relative"}>
              <NumberField className={inputClassName} {...props} {...field} />
              {children}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormNumberInput;
