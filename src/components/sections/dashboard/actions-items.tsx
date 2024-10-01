'use client';
import { Offer } from "@/models/offers";
import { useMemo } from "react";
import { Payout } from "../messages/chat-header";
import StatusBadge from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetActionItems } from "@/lib/react-query/user-query";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle } from "lucide-react";

const ActionItems = () => {
    const { isLoading, data, isSuccess } = useGetActionItems();

    const offers = useMemo(() => {
        if (isSuccess) {
            const offers = Array.from(data?.data).map((offer: any) => new Offer(offer));
            return offers;
        }
        return [];
    }, [data, isSuccess]);
    return (
        <main>
            <h2 className="text-lg mb-4 font-semibold">
                Action Items
            </h2>

            <ScrollArea className="h-[760px]">
                {isLoading && <Skeleton className="p-4 h-full" />}
                {offers.length === 0 && !isLoading && (
                    <div className="flex flex-col gap-6 justify-center bg-gray-50 rounded-xl h-[760px] items-center">
                       <img src="/images/illustrations/empty-dashboard.svg" alt="Empty Dashboard" className="w-[285.19px] h-[139.814px] " />
                        <p className="text-gray-600 text-xl">No action items available</p>
                    </div>
                )}

                <div className="grid gap-4">
                    {offers.map((offer, index) => (
                        <ActionCard offer={offer} key={index} />
                    ))}
                </div>
            </ScrollArea>
        </main>
    )
};

export default ActionItems;

type ActionCardProps = {
    offer: Offer;
    className?: string;
}

    const ActionCard = ({ offer, className }: ActionCardProps) => {
        return (
            <div className="rounded-[20px] p-4 border flex justify-between border-gray-300 bg-white">
                <div className="space-y-2">
                    <p className="text-sm space-x-2">
                        <span className="font-semibold">
                            Offer ID:
                        </span>
                        <span className="text-primary">
                            {offer.id}
                        </span>
                    </p>
                    <div className="flex justify-start gap-6">
                        <p className="text-sm flex gap-2">
                            <span className="font-semibold">
                                Offer total:
                            </span>
                            <span className="text-gray-800 font-medium">
                                ${offer.total_price}
                            </span>
                            <div className="flex">
                                <span className="font-semibold pr-2">
                                    Payout:
                                </span>
                                <Payout offer={offer} />
                            </div>
                        </p>
                    </div>
                    <p className="text-sm space-x-2">
                        <span className="font-semibold">
                            Products:
                        </span>
                        <span className="text-gray-800 font-medium text-ellipsis">
                            {offer.products.map(product => product.product_name).join(', ')}
                        </span>
                    </p>
                </div>
                <div className="flex flex-col gap-2 items-end justify-start">
                    <StatusBadge status={offer.offer_status} />
                    <div className="flex gap-2 items-end">
                        {
                            offer.readCount > 0 && (
                                <Link href={`/messages?offer_id=${offer.id}`}>
                                    <Button size={'sm'} variant={'ghost'}>
                                        <MessageCircle size={20} className="mr-2" /> {offer.readCount}
                                    </Button>
                                </Link>
                            )
                        }
                        {offer.readCount == 0 && <Link href={`/offers/edit/${offer.id}`}>
                            <Button className="text-primary" size={'sm'} variant={'ghost'}>
                                Update shipping details
                            </Button>
                        </Link>}
                    </div>
                </div>
            </div>
        )
    }