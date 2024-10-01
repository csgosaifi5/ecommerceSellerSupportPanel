import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormProvider from "../ui/form/FormProvider";
import FormGroupSelect from "../ui/form/form-select";
import FormCheckbox from "../ui/form/form-checkbox";
import FormInput from "../ui/form/FormInput";
import { Button } from "../ui/button";
import { useAddPaymentMethod } from "@/lib/react-query/payment-methods-query";
import { cn } from "@/lib/utils";

const options = [
  {
    label: "Cash App",
    value: "cash-app",
  },
  {
    label: "Paypal",
    value: "paypal",
  },
  {
    label: "Venmo",
    value: "venmo",
  },
  {
    label: "Zelle",
    value: "zelle",
  },
];

const formSchema = z.object({
  platform: z.string().min(2, { message: "Please select a payment method" }),
  default_method: z.boolean().optional(),
  label: z.string().min(2, { message: "Label is required" }),
  details: z.string().min(2, { message: "Details is required" }),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  onCanceled?: () => void;
  defaultValues: FormValues;
  row?: boolean;
  onSubmit: (data: FormValues) => void;
  isLoading: boolean;
};

const PaymentMethodForm = ({
  onCanceled,
  defaultValues,
  row = false,
  onSubmit,
  isLoading,
}: Props) => {
  const form = useForm<FormValues>({
    defaultValues: defaultValues,
    resolver: zodResolver(formSchema),
  });

  return (
    <FormProvider methods={form} onSubmit={form.handleSubmit(onSubmit)}>
      <div
        className={cn(
          "grid gap-5",
          row ? "grid-cols-1" : " md:grid-cols-2 grid-cols-1 "
        )}
      >
        <FormGroupSelect
          control={form.control}
          name="platform"
          label="Payment Method"
          options={options}
        />
        <FormCheckbox
          control={form.control}
          className="items-end pb-4"
          name="default_method"
          label="Mark as default payout"
        />
        <FormInput
          control={form.control}
          name="label"
          label="Label (For Ex: MyBofaAcct)"
        />
        <FormInput
          control={form.control}
          name="details"
          label="Payout ID (Email/ Phone Number/ Id) "
        />
      </div>
      <div className="flex justify-end pt-6 gap-4">
        <Button type="reset" variant={"outline"} onClick={onCanceled}>
          Cancel
        </Button>
        <Button disabled={isLoading} type="submit">
          {isLoading ? "Adding..." : "Add"}
        </Button>
      </div>
    </FormProvider>
  );
};

export default PaymentMethodForm;
