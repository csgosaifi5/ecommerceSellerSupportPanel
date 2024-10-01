import EstimatePriceDialog from "../forms/estimate-price-form";
import { Button } from "../ui/button";

const InfoSection = () => {
  return (
    <div className="mx-auto flex justify-center">
      <section className="md:mx-24 mx-6 px-6 w-full flex md:flex-row flex-col mt-12 rounded-[30px] justify-between gap-8 py-4 bg-white container-main">
        <header>
          <h2 className="text-lg mb-2.5 font-semibold text-gray-900">
            Evaluate your estimate
          </h2>
          <p className=" text-sm text-gray-800">
            Provide UPC and number of items to sell and quoted price to evaluate
            your estimate even before creating an offer.{" "}
          </p>
        </header>
        <EstimatePriceDialog>
          <Button
            size={"lg"}
            variant={"outline"}
            className="rounded-[8px] py-2 px-6 font-medium"
          >
            Evaluate
          </Button>
        </EstimatePriceDialog>
      </section>
    </div>
  );
};

export default InfoSection;
