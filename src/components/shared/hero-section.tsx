"use client";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import HeroSlide from "./hero-section-slider";
import { useGetBanners } from "@/lib/react-query/guest-query";
import { useMemo } from "react";
import { Skeleton } from "../ui/skeleton";

const HeroSection = () => {
  const { data, isSuccess, isLoading } = useGetBanners();
  const banners = useMemo(() => {
    if (isSuccess) {
      return Array.from(data.data.data);
    }

    return [];
  }, [data, isSuccess]);

  if(isLoading){
    return <Skeleton className="h-[60vh]" />
  }

  return (
    <section className="container-main ">
      <Splide
        options={{
          arrows: false,
          pagination: true,
          perPage: 1,
          type: 'loop',
          speed: 500,
          autoplay: true,
        }}
      >
        {banners.map((banner: any, index) => {
          return (
            <SplideSlide key={index}>
              <HeroSlide
                title={banner.title}
                description={banner.subtitle}
                image={banner.primary_image}
              />
            </SplideSlide>
          );
        })}
      </Splide>
    </section>
  );
};

export default HeroSection;
