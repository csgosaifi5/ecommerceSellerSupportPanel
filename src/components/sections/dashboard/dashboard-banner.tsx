import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useGetBanners } from "@/lib/react-query/guest-query";
import { PropsWithChildren, useMemo } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { ArrowRight } from "lucide-react";
import StatsSection from "@/components/shared/stats-section";

const DashboardBanner = ({ children }: PropsWithChildren) => {
  const { data, isSuccess, isLoading } = useGetBanners();

  const banners = useMemo(() => {
    if (isSuccess) {return Array.from(data.data.data);}
    return [];
  }, [data, isSuccess]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-5xl">
        <section className="container-main ">
          <Splide
            options={{
              arrows: false,
              perPage: 1,
              pagination: true,
            }}
          >
            {banners.map((banner: any, index) => {
              return (
                <SplideSlide key={index}>
                  <BannerSlide
                    title={banner.title}
                    description={banner.subtitle}
                    image={banner.primary_image}
                  />
                </SplideSlide>
              );
            })}
          </Splide>
        </section>
        <StatsSection size="md" />
      </DialogContent>
    </Dialog>
  );
};

export default DashboardBanner;

type Props = {
  title: string;
  image: string;
  description: string;
};

const BannerSlide = ({ title, image, description }: Props) => {
  return (
    <div className=" bg-white pt-10 flex rounded-[50px]">
      <div className=" flex-1 py-6 flex-col justify-between flex ">
        <header className="z-10 ">
          <h1 className="font-display mb-2 font-semibold  text-3xl">{title}</h1>
          <p className="text-lg text-[#030303]">{description}</p>
        </header>
        <div className="z-20 ">
          <Button
            size={"lg"}
            variant={"ghost"}
            className=" uppercase text-primary bg-white border py-6 border-primary rounded-full"
          >
            Start selling
            <ArrowRight size={20} className="ml-2" />
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <img
          width={800}
          height={800}
          src={image}
          alt="hero-image"
          className="object-cover h-56"
        />
      </div>
    </div>
  );
};
