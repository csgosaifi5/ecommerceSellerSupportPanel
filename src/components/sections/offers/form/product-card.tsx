import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { EllipsisIcon, Pencil, PencilIcon, Trash, Trash2Icon, TrashIcon } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { OfferFormValues } from "./offer-form";
import { useSearchParams } from "next/navigation";

type ProductCardProps = {
    className?: string;
    showForm?: () => void;
    deleteItem?: () => void;
    form: UseFormReturn<OfferFormValues>;
    index: number;
}

const ProductCard = ({ className, index, form, showForm, deleteItem }: ProductCardProps) => {
    const product = form.watch(`products.${index}`);
    const { remove } = useFieldArray({
        control: form.control,
        name: 'products'
    });
    const view = useSearchParams().get('view');


    const subtotal = Number(product?.quantity || 0.00) * (Number(product?.price) || 0.00);

    const error = form.formState.errors.products?.[index];

    return (
        <div className={cn("rounded-2xl flex gap-5 text-sm bg-white p-[18px]", error ? "bg-red-100 border-red-500 border text-red-600" : "", className)}>
            <div className="w-16 h-16 border bg-gray-300 rounded-lg">
            </div>
            <div className="flex justify-center gap-y-px text-gray-700 flex-col">
                <div className="flex items-center gap-4">
                    <div>
                        <span className="font-semibold">
                            UPC:
                        </span>
                        <span>
                            &nbsp;
                            {product?.upc || 'N/A'}
                        </span>
                    </div>
                    <Separator orientation="vertical" className="bg-gray-300 h-4" />
                    <div>
                        <span className="font-semibold">
                            Quantity:
                        </span>
                        <span>
                            &nbsp;
                            {product?.quantity || 0}
                        </span>
                    </div>
                    <div>
                        <span className="font-semibold">
                            Price:
                        </span>
                        <span>
                            &nbsp;
                            {product?.price || '0.00'}
                        </span>
                    </div>

                </div>
                <div>
                    <span className="font-semibold">
                        Item:
                    </span>
                    <span>
                        &nbsp;
                        {product?.product_name || 'N/A'}
                    </span>
                </div>
                {error && <div className="col-span-2 text-red-500 text-sm">
                    {error.message || "Fields are missing in product"}
                </div>}
            </div>
            <div className="ml-auto items-center gap-2 flex h-fit">
                <span>
                    Subtotal
                </span>
                <span className="font-semibold">
                    &nbsp;
                    ${subtotal.toFixed(2)}
                </span>
               {!view&& <DropdownMenu>
                    <DropdownMenuTrigger >
                        <EllipsisIcon size={20} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className="w-full" onClick={showForm}>
                            <PencilIcon size={16} className='mr-2' />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="w-full" onClick={deleteItem}>
                            <PencilIcon size={16} className='mr-2' />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>}
            </div>

        </div>);
}

export default ProductCard;




