import { ArrowRight } from "lucide-react";
import EstimatePriceDialog from "../forms/estimate-price-form";
import { Button } from "../ui/button";
import Link from "next/link";

type Props = {
  title: string;
  image: string;
  description: string;
};
const HeroSlide = ({ title, image, description }: Props) => {
  return (
    <div className="md:h-[400px] h-64 mb-12 flex justify-between  mt-9  relative bg-white rounded-[50px]">
      <div className=" md:h-[400px] h-64 flex-col justify-between flex xl:pt-[87px] md:pt-14 pt-6  sm:px-14 px-8">
        <header className="z-10">
          <h1 className="font-display mb-2 font-semibold md:text-[45px] text-3xl">
            {title}
          </h1>
          <p className="md:text-[22px]  text-[#030303]">{description}</p>
        </header>
        <div>
          <img
            src="/images/hero-bg-rounded.png"
            alt="hero-image"
            className="absolute bottom-0 left-0 sm:w-[490px] w-[350px] sm:h-[185px] h-32  object-cover"
          />
        </div>
        <Link href="/selling" className="z-20 sm:-ml-14 -ml-8 ">
          <Button
            size={"lg"}
            variant={"ghost"}
            className="sm:h-[86px] h-16 uppercase text-primary bg-white sm:px-24 px-12 rounded-full"
          >
            Start selling
          </Button>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="sm:h-[86px] h-16 sm:w-[86px] w-16 uppercase text-primary bg-white  rounded-full"
          >
            <ArrowRight />
          </Button>
        </Link>
      </div>
      <div className="relative  md:w-auto md:block hidden">
        <img
          src={image}
          alt="hero-image"
          className="right-0 h-full relative object-cover translate-y-[10%]  top-0"
        />
      </div>
    </div>
  );
};

export default HeroSlide;
