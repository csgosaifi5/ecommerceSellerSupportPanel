'use client';
import PendingIcon from "@/components/icons/pending";
import StatusBadge from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOfferById } from "@/lib/react-query/offer-query";
import { Offer } from "@/models/offers";
import dayjs from "dayjs";
import { CheckCircle2 } from "lucide-react";
import { useMemo } from "react";

type Props = {
    offer_id: string
}

const ChatHeader = ({ offer_id }: Props) => {
    const { data, isSuccess, isLoading } = useGetOfferById(offer_id);

    const offer = useMemo(() => {
        if (data) {
            return new Offer(data?.data.offer);
        }
        return null;
    }, [data, isLoading, isSuccess]);

    if (isLoading)
        return <Skeleton className="h-20 w-full" />

    const total = offer?.total_price;

    const products = offer?.products.map((product) => product.product_name) ?? [];

    return (
        <header className="border-b pt-5 pb-2 px-4 border-[#D9DBE1]">
            <div className="flex justify-between ">
                <div className="space-y-1.5">
                    <p className="font-semibold">Offer ID :
                        <span className="text-primary">
                            {offer_id}
                        </span>
                    </p>
                    <p className="text-sm">
                        <span className="font-semibold">
                            Created on:
                        </span>
                        &nbsp;
                        {dayjs(offer?.createdAt).format('MM/DD/YYYY, hh:mma')}
                    </p>
                </div>
                <div className="space-y-1.5">
                    <p className="font-medium items-center flex gap-3">
                        <span>
                            Total: ${total}
                        </span>
                        <span className="h-3 w-px bg-[#D1D5DB]"></span>
                        <span className="text-primary">
                            Payout:
                        </span>
                        {offer && <Payout offer={offer} />}
                    </p>
                    <div className="text-sm flex gap-3">
                        <span className="font-semibold">
                            Status: </span>
                        {<StatusBadge status={offer?.offer_status!} />}
                    </div>
                </div>
            </div>
            <div className="mt-2 flex items-center">
                <p>
                    Items: &nbsp; {offer?.productNames}
                </p>
                {products?.length > 1 ? <ItemsDropdown products={products}>
                    <Button variant={'link'} className="text-primary" size={'sm'}>{products.length - 1}</Button>
                </ItemsDropdown> : ""}

            </div>
        </header>
    );
};

export default ChatHeader;

type ItemsDropdownProps = {
    children: React.ReactNode,
    products: string[]
}

const ItemsDropdown = ({ children, products }: ItemsDropdownProps) => {
    return (<DropdownMenu>
        <DropdownMenuTrigger asChild>
            {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            {products.splice(0, 1).map((product, i) => (
                <DropdownMenuItem key={i}>
                    {product}
                </DropdownMenuItem>
            ))
            }

        </DropdownMenuContent>
    </DropdownMenu>);

}

export const Payout = ({ offer }: { offer: Offer }) => {
    const status = String(offer.payment_status).toUpperCase();
    if (status === 'PAID') {
        return (
            <CheckCircle2 size={20} className="text-green-600" />
        );
    };
    if (status === 'UNPAID') {
        return (
            <PendingIcon />
        );
    }
    return "-";
};