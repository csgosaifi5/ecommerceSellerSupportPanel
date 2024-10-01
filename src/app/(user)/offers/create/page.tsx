'use client';
import OfferFormBanner from "@/components/sections/offers/form/form-banner";
import OfferForm, { OfferFormValues } from "@/components/sections/offers/form/offer-form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useAuthStore } from "@/context/auth-context";
import { useAddOffer } from "@/lib/react-query/offer-query";
import { base64toFile } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const defaultValues: OfferFormValues = {
    products: [],
    images: [],
    expense_value: '',
    offer_status: 'draft',
    expense_field: '',
    customerRemarks: '',
    payment_method_id: '',
    total_price: 0
};

const CreateOfferPage = () => {
    const { mutate, isPending } = useAddOffer();
    const { userDetails } = useAuthStore();
    const router = useRouter();


    const onSubmit = (values: OfferFormValues) => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value as any);
        });

        formData.append('offers_products', JSON.stringify(values.products));

        let total_price: number = values.products.reduce((acc, product) => {
            return acc + parseFloat(product.price);
        }, 0);

        if (values.expense_value)
            total_price = total_price + parseFloat(values.expense_value ?? "0");

        //total price
        if (formData.has('total_price'))
            formData.set('total_price', total_price.toString());
        else
            formData.append('total_price', total_price.toString());

        //images
        if (values.images) {
            formData.delete('images');
            const files: File[] = values.images.map((image) => base64toFile(image.image_url, image.name));

            for (const file of files)
                formData.append('images', file);
        }



        //user_id
        formData.append("user_id", userDetails?.id?.toString() || "");
        formData.append("payment_status", "unpaid");

        mutate(formData, {
            onSuccess: () => {
                toast.success('Offer created successfully');
                router.push('/offers');
            },
            onError: (error: any) => {
                toast.error(error.message);
            }

        });
    }

    if(localStorage){
        const estimate =  localStorage.getItem('estimate');
        if(estimate){
            defaultValues.products =[JSON.parse(estimate)];
            localStorage.removeItem('estimate');
        }
    }
    
    
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
                        <Link href="/offers/create" className=" font-semibold text-gray-500">
                            Create offer
                        </Link>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <OfferFormBanner className="my-8" />
            <OfferForm loading={isPending} onSubmit={onSubmit} defaultValues={defaultValues} />
        </section>
    );
}

export default CreateOfferPage;