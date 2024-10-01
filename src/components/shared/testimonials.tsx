
"use client"
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide"
import "@splidejs/react-splide/css"
import "@splidejs/react-splide/css/core"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"
import { useGetTestimonials } from "@/lib/react-query/guest-query"
import { useMemo } from "react"
import { Skeleton } from "../ui/skeleton";


const Testimonials = () => {

    const { data, isSuccess, isLoading } = useGetTestimonials();
    const testimonials = useMemo(() => {
        if (isSuccess) {
            return data?.data.data.rows
        }
        return [];

    }, [data, isSuccess]);


    return (
        <section className="container-main xl:px-[56px] md:px-8 px-4 relative py-20">
            <Splide
                hasTrack={false}
                options={{
                    gap: "35px",
                    drag: "free",
                    arrows: true,
                    pagination: false,
                    autoWidth: false,
                    perPage: 3,
                    breakpoints: { 1024: { perPage: 2 }, 620: { perPage: 1 } },
                }}
                className="w-full"
                aria-label="My Favorite Images"
            >
                <header className="text-center mb-14 relative">
                    <h2 className="text-[32px] ">
                        Loved by our users
                    </h2>
                </header>

                <div>
                    <div className="w-full">
                        <SplideTrack>
                            {testimonials.map((testimonial: any, index: any) => (
                                <SplideSlide key={index}>
                                    <TestimonialCard {...testimonial} />
                                </SplideSlide>
                            ))}
                            {isLoading && Array.from({ length: 3 }).map((_, index) => (
                                <SplideSlide key={index}>
                                    <Skeleton className="h-96 bg-gray-300 w-full" />
                                </SplideSlide>
                            ))}
                        </SplideTrack>
                    </div>
                    <div
                        className={cn("splide__arrows items-center justify-center mt-8 flex gap-2  flex-row")}>
                        <button className="splide__arrow splide__arrow--prev !static">
                            <img
                                width="24"
                                height="24"
                                className="w-4"
                                src="https://img.icons8.com/ios-filled/50/chevron-left.png"
                                alt="chevron-right"
                            />
                        </button>
                        <button className="splide__arrow splide__arrow--next !static">
                            <img
                                width="24"
                                height="24"
                                className="w-4"
                                src="https://img.icons8.com/ios-filled/50/chevron-right.png"
                                alt="chevron-right"
                            />
                        </button>
                    </div>
                </div>

            </Splide>
        </section>
    )
}

export default Testimonials;

type Testimonial = {
    name: string
    designation: string
    image: string
    ratings: number
    message: string
}

const TestimonialCard = ({ name, designation, image: imageUrl, ratings, message: content }: Testimonial) => {
    return (
        <div className="bg-white p-8 rounded-[30px] ">
            <div className="flex  flex-col gap-4">
                <div className=" flex gap-2">
                    {[...Array(ratings)].map((_, index) => (
                        <Star className="text-yellow-500 fill-yellow-500 stroke-yellow-500" key={index} size={18} />
                    ))}
                </div>
                <p className="text-[#0B0B0B] mt-4 mb-12">&quot;{content}&quot;</p>
                <div className="flex gap-3 items-center justify-start">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-12 h-12 rounded-full"
                    />
                    <div>
                        <h3 className="text-[#0B0B0B] text-base">{name}</h3>
                        <p className="text-[#0B0B0B] font-semibold">{designation}</p>
                    </div>
                </div>
            </div>
        </div>
    )
};