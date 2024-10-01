"use client";
import DashboardApp from "@/components/sections/dashboard/dashboard-app";
import DashboardBanner from "@/components/sections/dashboard/dashboard-banner";
import EmptyDashboard from "@/components/sections/dashboard/empty-dashboard";
import LoadingScreen from "@/components/shared/loading-screen";
import { Button } from "@/components/ui/button";
import { useGetAllOffers } from "@/lib/react-query/offer-query";
import { Offer } from "@/models/offers";
import dayjs from "dayjs";
import { AlertOctagon } from "lucide-react";
import { use, useMemo } from "react";

const DashboardPage = () => {
  const { isLoading, data, isSuccess } = useGetAllOffers({
    filters: {
      startDate: dayjs().subtract(10, "year").startOf("d").toDate(),
      endDate: dayjs().add(1, 'day').startOf("d").toDate(),
    },
  });

  const hasOffers = useMemo(() => {
    if (isSuccess) {
      const offers = Array.from(data?.data).map(
        (offer: any) => new Offer(offer)
      );
      return offers.length > 0;
    }
    return false;
  }, [data, isSuccess]);

  if (isLoading) return <LoadingScreen className="h-[60vh]" />;
  return (
    <section className="container-main my-10">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-semibold my-4">My Dashboard</h1>
        <DashboardBanner>
          <Button variant={"ghost"}>
            <AlertOctagon size={16} className="mr-2" />
            {`What's New?`}
          </Button>
        </DashboardBanner>
      </header>

      {hasOffers && <DashboardApp />}
      {!hasOffers && <EmptyDashboard className="my-4" />}
    </section>
  );
};

export default DashboardPage;
