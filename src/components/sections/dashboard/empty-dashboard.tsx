import EstimatePriceDialog from "@/components/forms/estimate-price-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const EmptyDashboard = ({ className }: PropsWithClassName) => {
  return (
    <main
      className={cn(
        "p-4 rounded-[30px] space-y-4 py-20 flex flex-col justify-center items-center bg-white",
        className
      )}
    >
      <img
        src="/images/illustrations/empty-dashboard.svg"
        alt="Empty Dashboard"
        className="w-[285.19px] h-[139.814px] "
      />
      <p className="leading-normal max-w-sm  text-center">{`Welcome to Sellzey! Start creating offers to
                begin selling and unlock your business's potential.`}</p>
      <Link href="/offers/create">
        <Button>Create Offer</Button>
      </Link>

      <div className="max-w-md md:!my-20 my-10">
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
    </main>
  );
};

export default EmptyDashboard;
