import { Control, UseFormReturn, useFieldArray } from "react-hook-form";
import { OfferFormValues, itemFormValues } from "./offer-form";
import { cn, isObjectEmpty } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FormDescription, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import guestAPI from "@/lib/axios/guest-API";
import { z } from "zod";
import { Minus, Plus, ScanBarcodeIcon } from "lucide-react";

type Props = {
  form: UseFormReturn<OfferFormValues>;
  onCancel: () => void;
  saveItem: (item: itemFormValues) => void;
  className?: string;
  index?: number;
};

const emptyForm = {
  upc: "",
  product_name: "",
  brand: "",
  model: "",
  quantity: 0,
  price: "0",
};

export const productSchema = z.object({
  upc: z
    .string()
    .min(1, "UPC is required")
    .refine((val) => parseInt(val) > 0, {
      message: "UPC must be a number",
    }),
  product_name: z.string().min(1, "Product name is required"),
  brand: z.string().optional(),
  model: z.string().optional(),
  quantity: z.coerce.number().refine((val) => val > 0, {
    message: "Quantity must be greater than 0",
  }),
  price: z.coerce.number().refine((val) => val > 0, {
    message: "Price must be greater than 0",
  }),
});

const AddProductForm = ({ className, onCancel, saveItem }: Props) => {
  const [productForm, setProductForm] = useState<itemFormValues>(emptyForm);
  const view = useSearchParams().get("view");
  const [fetchingProductDetails, setFetchingProductDetails] = useState(false);
  const [errors, setErrors] = useState({
    upc: "",
    product_name: "",
    quantity: "",
    price: "",
  });

  const fetchProductDetails = async (upc: string) => {
    setFetchingProductDetails(true);
    try {
      const response = await guestAPI.getProductDetails(upc);
      const product = response.data.result;
      if (product) {
        setProductForm({
          ...productForm,
          product_name:
            productForm.product_name != ""
              ? productForm.product_name
              : product.title,
          brand: productForm.brand != "" ? productForm.brand : product.brand,
          model: productForm.model != "" ? productForm.model : product.model,
          price: productForm.price != "" ? productForm.price : product.price,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setFetchingProductDetails(false);
    }
  };
  const handleItem = () => {
    const valid = productSchema.safeParse(productForm);
    if (!valid.success) {
      const errorsArray = valid.error.errors.map((error) => ({
        name: error.path[0].toString(),
        message: error.message,
      }));
      const error = errorsArray.reduce((acc, curr) => {
        acc[curr.name] = curr.message;
        return acc;
      }, {} as any);
      setErrors(error);
      return;
    } else {
      saveItem(productForm);
      setProductForm(emptyForm);
      setErrors({
        upc: "",
        product_name: "",
        quantity: "",
        price: "",
      });
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl grid md:grid-cols-2 grid-cols-1  gap-5 bg-white p-[18px]",
        className
      )}
    >
      <FormInput
        label="UPC*"
        name={`upc`}
        icon={<ScanBarcodeIcon className="text-primary" />}
        error={errors.upc}
        value={productForm.upc}
        onBlurCapture={() => fetchProductDetails(productForm.upc)}
        setValues={setProductForm}
      />
      <FormInput
        label="Product name*"
        name={`product_name`}
        error={errors.product_name}
        value={productForm.product_name}
        disabled={fetchingProductDetails}
        setValues={setProductForm}
      />
      <FormInput
        label="Brand"
        name={`brand`}
        setValues={setProductForm}
        disabled={fetchingProductDetails}
        value={productForm.brand}
      />
      <FormInput
        label="Model"
        name={`model`}
        disabled={fetchingProductDetails}
        setValues={setProductForm}
        value={productForm.model}
      />
      <div className="flex gap-4 md:col-span-2 col-span-1 items-end">
        <FormInputNumber
          className="max-w-32"
          label="Quantity*"
          error={errors.quantity}
          name={`quantity`}
          setValues={setProductForm}
          value={productForm.quantity}
        />
        <FormInput
          className="max-w-32"
          label="Price*"
          type="number"
          name={`price`}
          error={errors.price}
          disabled={fetchingProductDetails}
          setValues={setProductForm}
          value={productForm.price}
        />
        <div className="ml-auto ">
          <span>Subtotal</span>
          <span className="font-semibold">
            &nbsp; $ {Number(productForm.quantity) * Number(productForm.price)}
          </span>
        </div>
      </div>
      <div className="space-x-4 md:col-span-2 flex justify-end">
        <Button onClick={onCancel} type="button" variant="outline">
          Cancel
        </Button>
        {!view && (
          <Button type="button" onClick={handleItem}>
            Add Item
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddProductForm;

type InputProps = {
  label?: string;
  setValues: any;
  name: string;
  icon?: React.ReactNode;
  error?: string;
  description?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const FormInput = ({
  name,
  label,
  error,
  className,
  description,
  setValues,
  ...props
}: InputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev: any) => ({ ...prev, [name]: e.target.value }));
  };
  return (
    <FormItem className={className}>
      {label && <Label>{label}</Label>}
      <div className={"relative"}>
        <Input onChange={handleChange} {...props} />
        <div className="absolute right-2 top-2">{props.icon}</div>
      </div>
      {error && (
        <FormDescription className="text-destructive">{error}</FormDescription>
      )}
      {description && <FormDescription>{description}</FormDescription>}
    </FormItem>
  );
};
export const FormInputNumber = ({
  name,
  label,
  error,
  className,
  description,
  setValues,
  ...props
}: InputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev: any) => ({ ...prev, [name]: e.target.value }));
  };

  const handleIncrement = () => {
    setValues((prev: any) => ({ ...prev, [name]: Number(prev[name]) + 1 }));
  };

  const handleDecrement = () => {
    setValues((prev: any) => ({ ...prev, [name]: Number(prev[name]) - 1 }));
  };
  return (
    <FormItem className={className}>
      {label && <Label>{label}</Label>}
      <div className={"relative"}>
        <Button
          onClick={handleIncrement}
          type="button"
          variant={"ghost"}
          size={"icon"}
          className="absolute right-2 w-8 h-8 top-1"
        >
          <Plus size={16} />
        </Button>
        <Input
          className="px-10 text-center"
          onChange={handleChange}
          {...props}
        />
        <Button
          variant={"ghost"}
          type="button"
          onClick={handleDecrement}
          size={"icon"}
          className="absolute left-2 w-8 h-8  top-1"
        >
          <Minus size={16} />
        </Button>
      </div>
      {error && (
        <FormDescription className="text-destructive">{error}</FormDescription>
      )}
      {description && <FormDescription>{description}</FormDescription>}
    </FormItem>
  );
};
