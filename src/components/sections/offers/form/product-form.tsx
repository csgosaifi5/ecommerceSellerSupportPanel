import { UseFormReturn } from "react-hook-form";
import { OfferFormValues, itemFormValues } from "./offer-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ProductCard from "./product-card";
import guestAPI from "@/lib/axios/guest-API";
import { FormInput, FormInputNumber, productSchema } from "./add-product-form";
import { ScanBarcode } from "lucide-react";

type Props = {
  form: UseFormReturn<OfferFormValues>;
  onCancel?: () => void;
  hideAddItem?: () => void;
  className?: string;
  index: number;
};

const ProductForm = ({ form, className, index, hideAddItem }: Props) => {
  const product = form.getValues(`products.${index}`);

  const [productForm, setProductForm] = useState<itemFormValues>(product);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({
    upc: "",
    product_name: "",
    quantity: "",
    price: "",
  });
  const [fetchingProductDetails, setFetchingProductDetails] = useState(false);

  const onCancel = () => {
    setShowForm(false);
    hideAddItem && hideAddItem();
  };
  const deleteItem = (index: number) => {
    form.setValue(
      "products",
      form.getValues("products").filter((_, i) => i !== index)
    );
  }

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

  const onSave = () => {
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
      form.setValue(`products.${index}`, productForm);
      setShowForm(false);
      setErrors({
        upc: "",
        product_name: "",
        quantity: "",
        price: "",
      });
    }
  };

  if (!showForm)
    return (
      <ProductCard
        showForm={() => setShowForm(true)}
        deleteItem={() => deleteItem(index)}
        form={form}
        index={index || 0}
        className={className}
      />
    );

  return (
    <div
      key={index}
      className={cn(
        "rounded-2xl grid grid-cols-2  gap-5 bg-white p-[18px]",
        className
      )}
    >
      <FormInput
        label="UPC*"
        disabled={fetchingProductDetails}
        icon={<ScanBarcode className="text-primary" />}
        onBlurCapture={(e) => fetchProductDetails(e.target.value)}
        name={`upc`}
        error={errors.upc}
        defaultValue={product.upc}
        value={productForm.upc}
        setValues={setProductForm}
      />
      <FormInput
        disabled={fetchingProductDetails}
        label="Product name"
        name={`product_name`}
        error={errors.product_name}
        value={productForm.product_name}
        defaultValue={productForm.product_name}
        setValues={setProductForm}
      />
      <FormInput
        label="Brand"
        name={`brand`}
        setValues={setProductForm}
        value={productForm.brand}
        disabled={fetchingProductDetails}
        defaultValue={product.brand}
      />
      <FormInput
        label="Model"
        disabled={fetchingProductDetails}
        name={`model`}
        value={productForm.model}
        setValues={setProductForm}
        defaultValue={product.model}
      />
      <div className="flex gap-4 md:col-span-2 col-span-1 items-start">
        <FormInputNumber
          className="max-w-32"
          label="Quantity"
          disabled={fetchingProductDetails}
          error={errors.quantity}
          name={`quantity`}
          value={productForm.quantity}
          setValues={setProductForm}
          defaultValue={product.quantity}
        />
        <FormInput
          className="max-w-32"
          label="Price"
          error={errors.price}
          name={`price`}
          value={productForm.price}
          setValues={setProductForm}
          disabled={fetchingProductDetails}
          defaultValue={product.price}
        />
        <div className="ml-auto ">
          <span>Subtotal</span>
          <span className="font-semibold">
            &nbsp; $ {Number(productForm.quantity) * Number(productForm.price)}
          </span>
        </div>
      </div>
      <div className="space-x-4 md:col-span-2 flex justify-end">
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button type="button" onClick={onSave}>
          Save Item
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
