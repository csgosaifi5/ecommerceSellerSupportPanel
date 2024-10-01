"use client";
import { PropsWithChildren, useMemo, useState } from "react";
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
import { QrCodeIcon, ScanBarcode } from "lucide-react";
import { StepperProvider, useStepper } from "@/context/stepper-context";
import { useGetEstimation } from "@/lib/react-query/user-query";
import Link from "next/link";
import { useAuthStore } from "@/context/auth-context";
import guestAPI from "@/lib/axios/guest-API";
import { cn } from "@/lib/utils";

const EstimatePriceForm = () => {
  const { currentStep } = useStepper();
  return (
    <>
      {currentStep === 0 && <Step1Form />}
      {currentStep === 1 && <Step2Form />}
      {currentStep === 2 && <Step3Form />}
    </>
  );
};

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .max(255, { message: "Email must be less than 255 characters" })
    .optional(),
  upc: z.string().min(3, { message: "UPC must be 4 characters long" }).refine((value)=>parseInt(value)>0,{message:"UPC must be a number"}),
  product_name: z
    .string().min(1, { message: "Product name is Required" })
    .max(255, { message: "Product name must be less than 255 characters" }),
  brand: z
    .string()
    .max(255, { message: "Brand must be less than 255 characters" }),
  model: z
    .string()
    .max(255, { message: "Model must be less than 255 characters" }),
  price: z.string().refine((value) => parseFloat(value) > 0, {
    message: "Price must be greater than zero",
  }),
  quantity: z.string().refine((value) => parseFloat(value) > 0, {
    message: "Quantity must be greater than zero",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  upc: "",
  product_name: "",
  brand: "",
  model: "",
  price: "0",
  quantity: "0",
};
const Step1Form = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { userDetails } = useAuthStore();
  const { goToStep } = useStepper();
  const [fetchingProductDetails, setFetchingProductDetails] = useState(false);
  const { mutate, isPending } = useGetEstimation();

  const onSubmit = (value: FormValues) => {
    mutate(value, {
      onSuccess: (data) => {
        if (data.data.result) {
          goToStep(1);
          if (localStorage) {
            localStorage.setItem("estimate", JSON.stringify(value));
          }
        } else {
          goToStep(2);
        }
      },
    });
  };

  const fetchProductDetails = async (upc: string) => {
    setFetchingProductDetails(true);
    try {
      const response = await guestAPI.getProductDetails(upc);
      const product = response.data.result;
      if (product) {
        if(!form.getValues("product_name"))
        form.setValue("product_name", product.title);

        if(!form.getValues("brand"))
        form.setValue("brand", product.brand);

        if(!form.getValues("model"))
        form.setValue("model", product.model);
      
        if(!form.getValues("price"))
        form.setValue("price", product.price);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setFetchingProductDetails(false);
    }
  };
  const price = form.watch("price");
  const quantity = form.watch("quantity");

  const totalPrice = useMemo(() => {
    return parseInt(price) * parseInt(quantity);
  }, [price, quantity]);

  return (
    <>
      <section className="flex flex-col">
        <header>
          <h2 className="text-xl font-semibold mb-1.5">
            Evaluate your Estimate
          </h2>
          <p className=" text-sm text-secondary-foreground">
            Provide UPC and number of items to sell and quoted price to evaluate
            your estimate even before creating an offer.{" "}
          </p>
        </header>
        <section className="mt-9">
          <FormProvider
            onSubmit={form.handleSubmit(onSubmit,(e)=>{console.log(e)})}
            methods={form}
            className="grid grid-cols-2 gap-4"
          >
            {!userDetails && (
              <>
                <FormInput
                  name="email"
                  control={form.control}
                  label="Email ID*"
                />
                <div />
              </>
            )}
            <FormInput
              className="relative"
              onBlurCapture={(e) => fetchProductDetails(e.target.value)}
              name="upc"
              control={form.control}
              label="UPC*"
            >
              {
                <ScanBarcode className="absolute right-2 bottom-2 w-6 h-6 text-primary" />
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
              label="Brand"
            />
            <FormInput
              disabled={fetchingProductDetails}
              name="model"
              control={form.control}
              label="Model"
            />
            <div className="flex gap-4">
              
              <FormInput
                type="number"
                className="max-w-32"
                disabled={fetchingProductDetails}
                name="quantity"
                control={form.control}
                label="Quantity*"
              />
              <FormInput
                type="number"
                disabled={fetchingProductDetails}
                className="max-w-32"
                name="price"
                control={form.control}
                label="Price*"
              />
            </div>
            <div className="flex gap-2 items-end justify-end">
              <span className="text-sm text-gray-700">Total</span>
              <span className="text-xl font-semibold text-gray-900 text-end leading-none">
                {totalPrice}
              </span>
            </div>
            <div className="col-span-2 gap-2 border-t pt-4 flex justify-end">
              <DialogClose asChild>
                <Button type="button" variant={"outline"}>
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isPending}>
                {isPending ? "Please wait..." : "Send Estimate"}
              </Button>
            </div>
          </FormProvider>
        </section>
      </section>
    </>
  );
};

const Step3Form = () => {
  return (
    <section className="flex flex-col">
      <header>
        <h2 className="text-xl font-semibold">Evaluate your Estimate</h2>
      </header>
      <main className="mt-9 flex gap-4 justify-between">
        <Image
          src="/images/illustrations/create-estimate.svg"
          className="flex-1 max-w-72"
          alt="estimate-success"
          width={300}
          height={300}
        />
        <div className="flex-1  flex flex-col h-full">
          <div className="">
            <h3 className="text-xl font-semibold">
              Thanks for creating this estimate{" "}
              <span className="text-primary">!!</span>
            </h3>
            <p className="text-gray-700">
              Sellzey team will review your estimate request and get back to
              you.
            </p>
          </div>
          <footer className="mt-auto justify-end flex gap-3">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </footer>
        </div>
      </main>
    </section>
  );
};

const Step2Form = () => {
  const { nextStep } = useStepper();
  const { userDetails } = useAuthStore();

  const nextLink = userDetails
    ? "/offers/create"
    : "/auth/login?redirect=/offers/create";
  return (
    <>
      <section className="flex flex-col">
        <header>
          <h2 className="text-xl font-semibold">Evaluate your Estimate</h2>
        </header>
        <main className="mt-9 flex gap-4 justify-between">
          <Image
            src="/images/illustrations/create-estimate.svg"
            className="flex-1 max-w-72"
            alt="estimate-success"
            width={300}
            height={300}
          />
          <div className="flex-1  flex flex-col h-full">
            <div className="">
              <h3 className="text-xl font-semibold">
                Congratulations <span className="text-primary">!!</span>
              </h3>
              <p className="text-gray-700">
                Your estimate is good to go. Go ahead and create an offer.
              </p>
            </div>
            <footer className="mt-auto justify-end flex gap-3">
              <Button variant="outline">Close</Button>
              <Link href={nextLink}>
                <Button>Create Offer</Button>
              </Link>
            </footer>
          </div>
        </main>
      </section>
    </>
  );
};

const EstimatePriceDialog = ({ children }: PropsWithChildren) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl py-14 px-16">
        <StepperProvider>
          <EstimatePriceForm />
        </StepperProvider>
      </DialogContent>
    </Dialog>
  );
};

export default EstimatePriceDialog;
