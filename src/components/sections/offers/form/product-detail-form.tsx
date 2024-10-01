import FormGroupSelect from "@/components/ui/form/form-select";
import { cn } from "@/lib/utils";
import { Control, UseFormReturn } from "react-hook-form";
import { OfferFormValues } from "./offer-form";
import { useGetPaymentMethods } from "@/lib/react-query/payment-methods-query";
import { useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import FormTextArea from "@/components/ui/form/FormTextArea";
import FormInput from "@/components/ui/form/FormInput";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import FormImageUploader from "@/components/ui/form-images";
import { useSearchParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogOverlay,
  AlertDialogPortal,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
type Props = {
  className?: string;
  form?: UseFormReturn<OfferFormValues>;
  control: Control<OfferFormValues>;
};

const OfferDetailForm = ({ className, control, form }: Props) => {
  const { data, isSuccess } = useGetPaymentMethods();
  const [showAddtionDetails, setShowAddtionDetails] = useState(false);
  const [noPaymentMethod, setNoPaymentMethod] = useState(false);
  const view = Boolean(useSearchParams().get("view"));
  const router = useRouter();

  const handleToggleAdditionDetails = () => {
    setShowAddtionDetails((prev) => !prev);
  };

  const paymentMethods = useMemo(() => {
    if (!isSuccess) return [];
    const options = Array.from(data.data.data).map((method: any) => ({
      label: method.label,
      value: method.id,
      details: method.details,
      platform: method.platform,
    }));
    if (options.length == 0) setNoPaymentMethod(true);
    return options;
  }, [isSuccess, data]);
  const optionSel = paymentMethods
    .filter((option) => option.value == form?.getValues("payment_method_id"))
    .pop();
  return (
    <div
      className={cn(
        "rounded-2xl grid   text-gray-700 bg-white p-[18px]",
        className
      )}
    >
      <h2 className="text-lg font-semibold mb-4">Payments Detail</h2>
      <FormGroupSelect
        disabled={view}
        placeholder="Select"
        defaultValue={"0"}
        className="max-w-sm"
        control={control}
        options={paymentMethods}
        name="payment_method_id"
        label="Payment Method"
      />
      {optionSel && (
        <label style={{ textTransform: "capitalize" }} className="pt-4">
          {optionSel?.platform} Id: {optionSel?.details}
        </label>
      )}
      <Separator className="my-8" />
      <h2 className="text-lg font-semibold mb-4">Additional Details</h2>
      <FormTextArea
        disabled={view}
        control={control}
        className="max-w-sm"
        name="customerRemarks"
        label="Customer Remarks"
        placeholder=" Write any additional information you want to share "
      />
      <br />
      <FormImageUploader
        disabled={view}
        control={control}
        name="images"
        label=" Images"
      />
      <Separator className="my-8" />

      <h2
        onClick={handleToggleAdditionDetails}
        className="text-lg font-semibold flex items-center mb-4 hover:!no-underline"
      >
        Additional Expenses{" "}
        <ChevronUp
          className={cn(
            "ml-2 text-primary transition-all duration-200",
            showAddtionDetails ? "rotate-0" : "rotate-180"
          )}
        />
      </h2>

      {showAddtionDetails && (
        <>
          <FormInput
            disabled={view}
            control={control}
            className="max-w-sm mb-4"
            name="expense_field"
            label="Expenses Type"
            placeholder=" Select Type "
          />
          <FormInput
            disabled={view}
            control={control}
            className="max-w-sm"
            inputClassName="pl-20"
            name="expense_value"
            label="Amount"
          >
            <div className=" border-r w-fit px-2 gap-1 flex items-center  h-10 absolute top-0  left-0 text-gray-500">
              <Plus />
              <ChevronDown size={16} className="" />
            </div>
          </FormInput>
        </>
      )}
      {noPaymentMethod && (
        <AlertDialog defaultOpen={true}>
          <AlertDialogPortal>
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>No Payment Method</AlertDialogTitle>
                <AlertDialogDescription>
                  There is no Payment method linked to this Account. Without
                  that you are not able to Send offer for Approval. Please add
                  one.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant={"destructive"}
                    onClick={() => router.push("/profile")}
                  >
                    Add Payout
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogPortal>
        </AlertDialog>
      )}
    </div>
  );
};

export default OfferDetailForm;
