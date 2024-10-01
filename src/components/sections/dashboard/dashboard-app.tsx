import { Button } from "@/components/ui/button";
import AnalyticsSection from "./analytics";
import ActionItems from "./actions-items";
import EstimatePriceDialog from "@/components/forms/estimate-price-form";

const DashboardApp = ({ className }: PropsWithClassName) => {
  return (
    <main className="md:grid md:grid-cols-12   md:grid-rows-5 gap-4">
      <div className="md:col-span-5 md:order-none order-1 md:row-span-4 p-8 bg-white rounded-[30px] ">
        <AnalyticsSection />
      </div>
      <div className="md:col-span-5 md:col-start-1 md:row-start-5 p-8 bg-white rounded-[30px] ">
        <header className="flex justify-between mb-4 items-center">
          <h2 className="text-lg font-semibold">Evaluate your estimate</h2>
          <EstimatePriceDialog>
          <Button variant={"outline"}>Evaluate</Button>
          </EstimatePriceDialog>
        </header>
        <p className="text-sm text-gray-800">
          Provide UPC and number of items to sell and quoted price to evaluate
          your estimate even before creating an offer.{" "}
        </p>
      </div>
      <div className="md:col-span-7 md:row-span-5 md:col-start-6 row-start-1 p-8 bg-white rounded-[30px] ">
        <ActionItems />
      </div>
    </main>
  );
};

export default DashboardApp;
