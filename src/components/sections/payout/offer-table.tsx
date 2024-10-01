import LoadingScreen from "@/components/shared/loading-screen";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TableBody, TableRow } from "@/components/ui/table";
import { useGetPayments } from "@/lib/react-query/offer-query";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Payout } from "../messages/chat-header";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import MessageIcon from "@/components/icons/message-icon";
import { Button } from "@/components/ui/button";
import { AccordionContent } from "@radix-ui/react-accordion";
import PayoutTable from "./payout-table";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ChatScreen from "../messages/chat-screen";
import Link from "next/link";

const OfferPayoutTable = () => {
  const [offer_id, setOfferId] = useState(null);
  const parmas = useSearchParams();
  const paymentMethods = parmas.get("payment_methods");
  const status = parmas.get("status");
  const sortBy = parmas.get("sort");

  const { data, isSuccess, isLoading } = useGetPayments();

  const offers = useMemo(() => {
    if (!isSuccess) return [];

    let offers = data.data;

    if (paymentMethods) {
      offers = offers.filter((offer: any) => {
        return (
          Array.from(offer.payments).findIndex(
            (payment: any) => payment.payment_method_id == paymentMethods
          ) != -1
        );
      });
    }

    if (status) {
      offers = offers.filter((offer: any) => offer.offer_status === status);
    }

    if (sortBy === "highest-to-lowest") {
      offers = offers.sort((a: any, b: any) => b.total_price - a.total_price);
    }

    if (sortBy === "lowest-to-highest") {
      offers = offers.sort((a: any, b: any) => a.total_price - b.total_price);
    }

    if (sortBy === "newest-first") {
      offers = offers.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    if (sortBy === "oldest-first") {
      offers = offers.sort(
        (a: any, b: any) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    return offers;
  }, [data, paymentMethods, status, sortBy]);

  isLoading && <LoadingScreen className="h-52" />;

  return (
    <Sheet>
      <Accordion type="multiple" className="mt-4 space-y-2">
        {offers.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No Payouts Found.{" "}
           
          </div>
        )}
        {offers.map((offer: any) => (
          <AccordionItem
            className="bg-white border overflow-hidden items-center border-gray-300 rounded-xl  tex-sm flex flex-col "
            key={offer.id}
            value={offer.id}
          >
            <table className="w-full">
              <TableBody className="flex w-full items-center p-4">
                <TableRow className="flex-1 border-none">
                  <td className="text-gray-600">Offer ID</td>
                  <td className="text-primary ml-2 font-medium">{offer.id}</td>
                </TableRow>
                <TableRow className="md:block hidden flex-1 border-none">
                  <td className="text-gray-600">Offer total</td>
                  <td className="text-black ml-2 font-medium">
                    ${offer.total_price}
                  </td>
                </TableRow>
                <TableRow className="md:block hidden flex-1 border-none mr-8">
                  <td className="text-gray-600 text-nowrap">
                    Pending amount &nbsp;
                  </td>
                  <td className="text-black ml-2 font-medium">
                    $
                    {offer.total_price -
                      offer.payments.reduce(
                        (acc: any, curr: any) => acc + curr.amount,
                        0
                      )}
                  </td>
                </TableRow>
                <TableRow className="flex-1  md:flex hidden border-none">
                  <td className="text-black font-medium">Payout</td>
                  <td className="text-black ml-2 font-medium">
                    <Payout offer={offer} />
                  </td>
                </TableRow>

                <TableRow className="border-none md:flex-[2] flex-1">
                  <td
                    className={cn(
                      "flex gap-2",
                      offer.readCount > 0 ? "text-black" : "text-[#6B7280]"
                    )}
                  >
                    <SheetTrigger onClick={() => setOfferId(offer.id)}>
                      <MessageIcon />
                      {offer.readCount > 0 ? offer.readCount : ""}
                    </SheetTrigger>
                  </td>
                </TableRow>
                <TableRow className="border-none flex-1">
                  <td>
                    <AccordionTrigger asChild>
                      <Button variant={"ghost"} className="w-fit" size={"sm"}>
                        <ChevronDown size={20} />
                      </Button>
                    </AccordionTrigger>
                  </td>
                </TableRow>
              </TableBody>
            </table>
            <AccordionContent className="w-full ">
              <PayoutTable transactions={offer.payments} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <SheetContent className="sm:max-w-2xl w-full">
        <ChatScreen offer_id={String(offer_id)} />
      </SheetContent>
    </Sheet>
  );
};

export default OfferPayoutTable;
