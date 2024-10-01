"use client";
import { PropsWithChildren, useMemo, useRef, useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import FormProvider from "../ui/form/FormProvider";
import { useForm } from "react-hook-form";
import Image from "next/image";
import FormInput from "../ui/form/FormInput";
import { Button } from "../ui/button";
import { QrCodeIcon } from "lucide-react";
import { StepperProvider, useStepper } from "@/context/stepper-context";
import { useGetEstimation } from "@/lib/react-query/user-query";
import Link from "next/link";
import { useAuthStore } from "@/context/auth-context";
import guestAPI from "@/lib/axios/guest-API";
import { useRequestProductDetails } from "@/lib/react-query/guest-query";
import { toast } from "sonner";

const formSchema = z.object({
  upc: z.string().min(3, { message: "UPC must be 4 characters long" }),
  product_name: z
    .string()
    .max(255, { message: "Product name must be less than 255 characters" }),
  brand: z
    .string()
    .max(255, { message: "Brand must be less than 255 characters" }),
  model: z
    .string()
    .max(255, { message: "Model must be less than 255 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  upc: "",
  product_name: "",
  brand: "",
  model: "",
};
const RequestProductForm = () => {
  const dialogClose = useRef<HTMLButtonElement>(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [fetchingProductDetails, setFetchingProductDetails] = useState(false);
  const { mutate, isPending } = useRequestProductDetails();

  const onSubmit = (value: FormValues) => {
    mutate(value, {
      onSuccess: () => {
        form.reset(defaultValues);
        dialogClose.current?.click();
        toast.success("Product request sent successfully");
      },
      onError: (error) => {
        console.log(error);
        toast.error("Error sending product request");
      },
    });
  };

  const fetchProductDetails = async (upc: string) => {
    setFetchingProductDetails(true);
    try {
      const response = await guestAPI.getProductDetails(upc);
      const product = response.data.result;
      if (product) {
        if (!form.getValues("product_name"))
          form.setValue("product_name", product.title);

        if (!form.getValues("brand")) form.setValue("brand", product.brand);

        if (!form.getValues("model")) form.setValue("model", product.model);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setFetchingProductDetails(false);
    }
  };

  return (
    <>
      <section className="flex flex-col">
        <DialogClose ref={dialogClose} />
        <header>
          <h2 className="text-xl font-semibold mb-1.5">Request Product</h2>
          <p className=" text-sm text-secondary-foreground">
            Please fill out the form below to request a product
          </p>
        </header>
        <section className="mt-9">
          <FormProvider
            onSubmit={form.handleSubmit(onSubmit)}
            methods={form}
            className="grid grid-cols-2 gap-4"
          >
            <FormInput
              className="relative"
              onBlurCapture={(e) => fetchProductDetails(e.target.value)}
              name="upc"
              control={form.control}
              label="UPC*"
            >
              {
                <QrCodeIcon className="absolute right-2 bottom-2 w-6 h-6 text-primary" />
              }
            </FormInput>
            <FormInput
              disabled={fetchingProductDetails}
              name="product_name"
              control={form.control}
              label="Product Name*"
            />
            <FormInput
              disabled={fetchingProductDetails}
              name="brand"
              control={form.control}
              label="Brand*"
            />
            <FormInput
              disabled={fetchingProductDetails}
              name="model"
              control={form.control}
              label="Model*"
            />

            <div className="col-span-2 gap-2 border-t pt-4 flex justify-end">
              <DialogClose asChild>
                <Button type="button" variant={"outline"}>
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isPending}>
                {isPending ? "Please wait..." : "Request Product"}
              </Button>
            </div>
          </FormProvider>
        </section>
      </section>
    </>
  );
};

const RequestProductDialog = ({ children }: PropsWithChildren) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl py-14 px-16">
        <RequestProductForm />
      </DialogContent>
    </Dialog>
  );
};

export default RequestProductDialog;
