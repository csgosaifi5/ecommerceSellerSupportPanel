import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { OfferFormValues } from "./offer-form";

type Props = {
  className?: string;
  form: UseFormReturn<OfferFormValues>;
};

export const OfferSummary = ({ className, form }: Props) => {
  const values = form.watch();

  const total = values.products.reduce((acc, item) => {
    return acc + Number(item.quantity) * Number(item.price);
  }, 0);

  const addtionalExpenses = Number(values.expense_value) || 0;

  const subTotal = total + addtionalExpenses;
  return (
    <div
      className={cn(
        "rounded-2xl grid   text-gray-700 bg-white p-[18px]",
        className
      )}
    >
      <h2 className="font-semibold text-sm mb-5 text-[#1F2A37]">
        Offer Summary
      </h2>
      <div className="flex mb-2 text-sm justify-between">
        <span>Total offer Value</span>
        <span className="font-semibold">${total.toFixed(2)}</span>
      </div>
      <div className="flex text-sm justify-between">
        <span>Additional Expenses</span>
        <span className="font-semibold">${addtionalExpenses.toFixed(2)}</span>
      </div>
      <Separator className="mt-12 mb-4 bg-gray-300" />
      <div className="flex font-semibold mb-2 text-sm justify-between">
        <span>Subtotal</span>
        <span>${subTotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

type ApprovalStatusProps = {
  className?: string;
  status: string;
  loading?: boolean;
  form: UseFormReturn<OfferFormValues>;
};

export const ApprovalStatus = ({
  className,
  loading = false,
  status,
  form,
}: ApprovalStatusProps) => {
  const handleSendForApproval = () => {
    form.setValue("offer_status", "sent");
  };

  const handleSaveAsDraft = () => {
    form.setValue("offer_status", "draft");
  };

  const isNotApproved = ["draft"].includes(status);

  if (isNotApproved) {
    return (
      <div className={cn("grid gap-4", className)}>
        <Button disabled={loading} onClick={handleSendForApproval}>
          {loading ? "Loading..." : "Send for Approval"}
        </Button>
        <Button
          disabled={loading}
          onClick={handleSaveAsDraft}
          variant="ghost"
          className="text-primary"
        >
          {loading ? "Loading..." : "Save as Draft"}
        </Button>
      </div>
    );
  }

  return null;
};

type StepsProps = {
  className?: string;
  status: string;
};

export const Steps = ({ className, status }: StepsProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl grid   text-gray-700 bg-white p-[18px]",
        className
      )}
    >
      <h2 className="mb-6 text-lg font-semibold">Status</h2>
      <ol className=" overflow-hidden space-y-8">
        {Array.from({ length: 4 }).map((e, index) => (
          <li
            key={index}
            className="relative flex-1 last:after:hidden after:content-[''] h-12 after:w-0.5 after:h-20  after:bg-[#51A34E] after:inline-block after:absolute after:-bottom-12 after:left-[7px]"
          >
            <a href="#" className="flex items-center font-medium w-full  ">
              <span className="w-4 h-4 bg-[#51A34E] border-2 border-transparent rounded-full mr-6 "></span>
              <div className="block">
                <h4 className="text-sm">Sent for Approval</h4>
                <span className="text-sm font-semibold">Wed, 12th Sep</span>
              </div>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
};
