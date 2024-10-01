import ProfileIcon from "@/components/icons/profile-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import SelectField from "@/components/ui/select-group";
import { Skeleton } from "@/components/ui/skeleton";
import useMessageSelection from "@/hooks/message-filter";
import useOfferFilter from "@/hooks/offer-table-filter";
import {
  useGetAllOffers,
  useGetOffersForMessages,
} from "@/lib/react-query/offer-query";
import { cn } from "@/lib/utils";
import { Offer } from "@/models/offers";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Clock, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const options = [
  {
    label: "All Messages",
    value: "all",
  },
  {
    label: "Read",
    value: "read",
  },
  {
    label: "Unread",
    value: "unread",
  },
];

type Props = {
  selectedOffer: string | null;
  setSelectedOffer: Function;
};

const OrdersSidebar = () => {
  const { selectedOffer, setSelectedOffer } = useMessageSelection();
  const [filter, setFilter] = useState({ status: "all", search: "" });
  const queryClient = useQueryClient();
  const { isLoading, data, isSuccess } = useGetOffersForMessages(filter);

  const handleSearch = (e: any) => {
    setFilter({ ...filter, search: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    setFilter({ ...filter, status: value });
  };

  useEffect(() => {
    setTimeout(() => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "offers" && query.queryKey[1] === "messages",
      });
    }, 1000);
  }, [selectedOffer]);

  const offers = useMemo(() => {
    if (isSuccess) {
      const offers = Array.from(data?.data).map(
        (offer: any) => new Offer(offer)
      );

      return offers;
    }
    return [];
  }, [data, isSuccess, filter]);

  return (
    <div className="w-full">
      <div className="py-4 px-6 border-[#D3D3D3]  border-b">
        <SelectField
          onValueChange={handleStatusChange}
          value={filter.status}
          options={options}
        />
      </div>
      <div className="py-4 px-6 border-[#D3D3D3]  border-b">
        <div className="relative">
          <Search
            size={18}
            className="absolute top-2.5  text-gray-500 left-3"
          />
          <Input
            onChange={handleSearch}
            placeholder="Search"
            className=" pl-10 rounded-3xl bg-[#F8F9FD]"
            type="search"
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-250px)]">
        {isLoading && <Skeleton className=" h-full w-full " />}
        <div className="grid">
          {offers.map((offer: any, i: number) => (
            <ContactSlide
              setSelected={() => setSelectedOffer(offer.id)}
              active={offer.id == selectedOffer}
              offer={offer}
              key={i}
            />
          ))}
          {offers.length === 0&&!isLoading && (
            <div className="flex justify-center items-center h-24 text-gray-600">
              No offers found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

const ContactSlide = ({
  offer,
  active,
  setSelected,
}: {
  offer: Offer;
  active: boolean;
  setSelected: Function;
}) => {
  const products = offer.products.map((product) => product.product_name);

  return (
    <Button
      onClick={() => setSelected()}
      variant={"ghost"}
      className={cn(
        "px-6 relative justify-start gap-3 items-start rounded-none flex py-4 h-24 border-b border-[#D3D3D3]",
        active ? "bg-[#F7F6F5]" : ""
      )}
    >
      <ProfileIcon />
      <div className="space-y-[1px] flex flex-col items-start">
        <span className=" text-[15px] font-semibold text-gray-900">
          Offer ID :{offer.id}
        </span>
        <span className="block text-sm truncate font-medium text-gray-400 text-start">
          Items: {offer.productNames}
        </span>
       {offer?.latestMessage&& <div className="flex gap-3 py-2 items-center text-[#AFB8CF]">
          <Clock size={18} />
          <span>{`${offer?.latestMessage?.time}`}</span>
        </div>}
      </div>
      {offer.unreadMessageCount > 0 && (
        <span className="absolute bg-blue-600 text-white text-xs p-1 w-6 h-6 rounded-full right-3 top-3">
          {offer.unreadMessageCount}
        </span>
      )}
    </Button>
  );
};

export default OrdersSidebar;
