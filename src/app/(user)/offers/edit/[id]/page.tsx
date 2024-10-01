"use client";
import OfferFormBanner from "@/components/sections/offers/form/form-banner";
import OfferForm, {
  OfferFormValues,
} from "@/components/sections/offers/form/offer-form";
import LoadingScreen from "@/components/shared/loading-screen";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useGetOfferById, useUpdateOffer } from "@/lib/react-query/offer-query";
import { base64toFile } from "@/lib/utils";
import Link from "next/link";
import {
  useParams,
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

const OfferEditPage = () => {
  const { id } = useParams();
  const { mutate,isPending } = useUpdateOffer();
  const viewMode = useSearchParams().get("view");
  const router = useRouter();
  const pathname = usePathname();

  const { isLoading, data, isSuccess } = useGetOfferById(String(id));

  const offer = useMemo(() => {
    if (isSuccess) {
      const offerData = data.data.offer;
      let images = [];
      if (offerData.images) {
        images = offerData.images.split(",").map((image: string) => {
          return {
            image_url: image,
            name: image.split("/").pop(),
          };
        });
      }

      const formValues: OfferFormValues = {
        products: Array.from(offerData.offers_products).map((product: any) => ({
          upc: String(product.upc),
          id: product.id,
          product_name: String(product.product_name),
          brand: product.brand ? String(product.brand) : undefined,
          model: product.model ? String(product.model) : undefined,
          quantity: product.quantity,
          price: String(product.price),
        })),
        offer_status: offerData.offer_status,
        images: images,
        expense_value: offerData.expense_value,
        expense_field: offerData.expense_field,
        customerRemarks: offerData.customerRemarks,
        payment_method_id: String(offerData.payment_method_id),
        total_price: offerData.total_price,
        id: offerData.id,
      };

      return formValues;
    }

    return null;
  }, [data]);

  useEffect(() => {
    if (!offer) return;

    const isApproved =
      offer.offer_status !== "draft" && offer.offer_status !== "sent";
    if (isApproved) {
      router.push(`${pathname}?view=true`);
    }
  }, [offer, viewMode]);

  const onSubmit = (values: OfferFormValues) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value as any);
    });

    //offers_products
    formData.delete("products");
    formData.append("offers_products", JSON.stringify(values.products));
    
    //total_price

    let total_price: number = values.products.reduce((acc, product) => {
      return acc + parseFloat(product.price);
    }, 0);

    if (values.expense_value)
      total_price = total_price + parseFloat(values.expense_value ?? "0");

    //total price
    if (formData.has("total_price"))
      formData.set("total_price", total_price.toString());
    else formData.append("total_price", total_price.toString());

    //images
    if (values.images) {
      const filteredImages = values.images.filter((image) =>
        image.image_url.startsWith("data:image/")
      );

      formData.delete("images");
      if (filteredImages.length === 0) {
        formData.set(
          "images",
          values.images.map((image) => image.image_url).join(",")
        );
      }

      const files: File[] = filteredImages.map((image) =>
        base64toFile(image.image_url, image.name)
      );

      for (const file of files) formData.append("images", file);
    }

    mutate(formData, {
      onSuccess: (data) => {
        toast.success(data.data.message || "Offer updated successfully");
      },
      onError: (error: any) => {
        toast.error(error.message);
      },
    });
  };

  if (isLoading && !offer)
    return (
      <LoadingScreen className="container-main my-10 bg-gray-200 min-h-[80vh]" />
    );
  else if (!offer) return <NotFoundScreen />;

  return (
    <section className="container-main py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/offers" className=" font-semibold text-gray-800">
                My offers
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link
              href="/offers/edit/id"
              className=" font-semibold text-gray-500"
            >
              Offer - {id}
            </Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <OfferFormBanner offer={offer} className="my-8" />

      {offer && <OfferForm onSubmit={onSubmit} loading={isPending} defaultValues={offer} />}
    </section>
  );
};

export default OfferEditPage;

const NotFoundScreen = () => {
  return (
    <div className="container-main bg-red-50 text-red-500 border flex-col gap-5 border-red-500 rounded-xl m-10 text-xl font-semibold flex justify-center items-center min-h-[80vh]">
      <span>Offer not found</span>
      <Button>
        <Link href="/offers">Go back to Offers</Link>
      </Button>
    </div>
  );
};
