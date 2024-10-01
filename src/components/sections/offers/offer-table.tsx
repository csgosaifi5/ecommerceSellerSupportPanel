"use client";
import offerColumns from "@/columns/payment-offers";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import DateRangePicker from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useGetAllOffers } from "@/lib/react-query/offer-query";
import { Offer } from "@/models/offers";
import dayjs from "dayjs";
import useOfferFilter from "@/hooks/offer-table-filter";
import Link from "next/link";

const OfferTable = () => {
  const { filter, setFilter } = useOfferFilter();

  const { isLoading, data, isSuccess } = useGetAllOffers({ filters: filter });

  const offers = useMemo(() => {
    if (isSuccess) {
      const offers = Array.from(data?.data).map(
        (offer: any) => new Offer(offer)
      );
      return offers;
    }
    return [];
  }, [data, isSuccess, filter]);

  const totalPage = useMemo(() => {
    if (isSuccess) {
      return Math.ceil(data.total / 10);
    }
    return 0;
  }, [data, isSuccess]);

  const handleSearch = (e: string) => {
    setFilter({ ...filter, search: e, page: 1 });
  };

  const changePage = (page: number) => {
    setFilter({ ...filter, page });
  };

  const onDateRangeChange = (startDate?: Date, endDate?: Date) => {
    if (!startDate || !endDate)
      setFilter({
        ...filter,
        startDate: dayjs().subtract(10, "year").toDate(),
        endDate: dayjs().toDate(),
        page: 1,
      });
    else setFilter({ ...filter, startDate, endDate, page: 1 });
  };

  return (
    <section className="container-main min-h-[60vh]  my-12">
      <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
        <h2 className="text-xl font-semibold">My Offers</h2>
        <div className="flex gap-5 flex-wrap">
          <div className="relative min-w-60 flex-1">
            <Search size={18} className="absolute top-2.5 left-2.5" />
            <Input
              placeholder="Search"
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 "
            />
          </div>
          <DateRangePicker
            onValueChange={(range) => onDateRangeChange(range?.from, range?.to)}
          />
          <Link href="/offers/create">
            <Button>
              <Plus
                size={18}
                className="mr-2 bg-white text-primary p-px rounded-full"
              />
              Create Offer
            </Button>
          </Link>
        </div>
      </header>
      <main className="mt-4">
        <DataTable
          page={filter.page}
          columns={offerColumns}
          data={offers}
          totalPage={totalPage}
          changePage={changePage}
        />
      </main>
    </section>
  );
};

export default OfferTable;
