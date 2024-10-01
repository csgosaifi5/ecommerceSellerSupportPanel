"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormProvider from "@/components/ui/form/FormProvider";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import ProductForm from "./product-form";
import { OfferSummary, ApprovalStatus, Steps } from "./offer-summary";
import OfferDetailForm from "./product-detail-form";
import { useState } from "react";
import AddProductForm from "./add-product-form";
import { offerStatus } from "@/types/constants";
import TrackingPackage from "./offer-tracking";
import { useSearchParams } from "next/navigation";
import { FormDescription } from "@/components/ui/form";

export const itemSchema = z.object({
  id: z.number().optional(),
  upc: z
    .string()
    .min(1, { message: "UPC is required" })
    .refine((val) => parseInt(val) > 0, {
      message: "UPC must be a number",
    }),
  product_name: z.string().min(1, { message: "Product name is required" }),
  brand: z.string().optional(),
  model: z.string().optional(),
  quantity: z.number().refine((val) => val > 0, {
    message: "Quantity must be greater than 0",
  }),
  price: z.string().refine((val) => parseFloat(val) > 0, {
    message: "Price must be greater than 0",
  }),
});

export type itemFormValues = z.infer<typeof itemSchema>;

const offerSchema = z.object({
  id: z.number().optional(),
  products: z.array(itemSchema),
  offer_status: z
    .string()
    .refine((val) => offerStatus.includes(val), { message: "Invalid status" }),
  images: z.array(z.any()).optional(),
  expense_value: z.string().optional(),
  expense_field: z.string().optional(),
  customerRemarks: z.string().optional(),
  payment_method_id: z.string().optional(),
  total_price: z.coerce.number().optional(),
});
export type OfferFormValues = z.infer<typeof offerSchema>;

type Props = {
  onSubmit: (values: OfferFormValues) => void;
  defaultValues?: OfferFormValues;
  editMode?: boolean;
  loading?: boolean;
};

const OfferForm = ({ onSubmit, defaultValues, loading }: Props) => {
  const [showAddItem, setShowAddItem] = useState(!Boolean(defaultValues?.id));
  const form = useForm({
    resolver: zodResolver(offerSchema),
    defaultValues,
  });

  const view = useSearchParams().get("view");

  const { append, fields } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const handleAddItem = () => {
    setShowAddItem(true);
  };

  const appendItem = (item: itemFormValues) => {
    append(item);
  };

  const isApproved =
    defaultValues?.offer_status &&
    defaultValues.offer_status !== "draft" &&
    defaultValues.offer_status !== "sent";

  const handleSubmit = (values: OfferFormValues) => {
    if (values.offer_status === "sent") {
      console.log(values.payment_method_id);
      if (
        values.payment_method_id === undefined ||
        values.payment_method_id === "" ||
        values.payment_method_id == "0"
      ) {
        form.setError("payment_method_id", {
          type: "required",
          message: "Payment method is required",
        });
        return;
      }
      if (values.products.length === 0) {
        form.setError("products", {
          type: "required",
          message: "At least one product is required",
        });
        return;
      }
    }

    if (values.offer_status === "draft") {
      values.payment_method_id = "0";
    }
    onSubmit(values);
  };
  return (
    <main>
      <FormProvider
        methods={form}
        className="grid gap-6 md:grid-cols-12 grid-cols-6"
        onSubmit={form.handleSubmit(handleSubmit, (err) => console.error(err))}
      >
        <div className="col-span-8">
          {showAddItem && (
            <>
              <header className="flex items-end  justify-between">
                <h2 className=" text-xl font-semibold text-[#333]">
                  Add Items
                </h2>
              </header>
              <main className="mt-4 space-y-4 mb-8 ">
                <AddProductForm
                  saveItem={appendItem}
                  onCancel={() => setShowAddItem(false)}
                  form={form}
                />
              </main>
            </>
          )}
          <header className="flex items-end -mt-3 justify-between">
            <h2 className=" text-xl font-semibold ml-1 text-[#333]">Items</h2>
            {!view && (
              <Button
                disabled={showAddItem}
                onClick={handleAddItem}
                variant={"outline"}
                type="button"
              >
                New Item
              </Button>
            )}
          </header>
          <main className="mt-4 space-y-4">
            {fields.map((field, index) => {
              return <ProductForm key={field.id} index={index} form={form} />;
            })}
            {form.formState.errors.products && (
              <FormDescription className="text-red-500">
                {form.formState.errors.products.message}
              </FormDescription>
            )}

            <OfferDetailForm
              control={form.control}
              form={form}
              className="mt-4"
            />
          </main>
        </div>
        <div className="col-span-4">
          <OfferSummary form={form} className="mt-[44px]" />
          <ApprovalStatus
            loading={loading}
            form={form}
            status={defaultValues?.offer_status || ""}
            className="my-4"
          />

          {defaultValues?.offer_status == "sent" && (
            <div className="mt-4 text-sm text-center bg-white py-4 font-semibold shadow-sm rounded-md text-gray-700">
              Offer is under review
            </div>
          )}
          {/* {isApproved && (
            <Steps
              status={defaultValues?.offer_status || ""}
              className="mt-4"
            />
          )} */}
          {isApproved && <TrackingPackage form={form} className="mt-4" />}
        </div>
      </FormProvider>
    </main>
  );
};

export default OfferForm;
