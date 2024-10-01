import { cn } from "@/lib/utils";
import Image from "next/image";

const StepsSection = () => {
    return (
        <section className="container-main poppins mt-8 md:px-24 ">
            <header className="flex justify-center py-12">
                <h1 className=" text-[32px]">Get <span className="gradient-text relative font-semibold">Cash
                    <UnderLine className="absolute -bottom-2 -left-2" /></span> in Three Simple Steps</h1>
            </header>
            <main className="flex md:flex-row pb-12 flex-col">
                <StepCard title="Create an Offer" description="Ready to make sales? Create an offer and sell your products to us today" imageUrl="/images/step-1.svg" />
                <Seperator />
                <StepCard title="Ship the Products" description="Once your offer is approved , it's time to pack and ship your products to our warehouse." imageUrl="/images/step-2.svg" />
                <Seperator />
                <StepCard title="Get Paid" description="No more waiting around, get paid once your products are delivered to us." imageUrl="/images/step-3.svg" />
            </main>
        </section>
    );
}

export default StepsSection;

type StepCardProps = {
    title: string;
    description: string;
    imageUrl: string;
}

const StepCard = ({ title, description, imageUrl }: StepCardProps) => {
    return (
        <div className="flex bg-white p-8 rounded-[30px] flex-col gap-4">
            <div>
                <h3 className="text-[22px]  text-[#462512] pb-4 text-center font-semibold">{title}</h3>
                <p className="text-sm text-center text-[15px] leading-[26px] text-[#4B4B4B] ">{description}</p>
            </div>
            <div className="flex items-center justify-center rounded-lg">
                <img className="mt-8" src={imageUrl} alt={title} />
            </div>
        </div>
    );
}
import React from "react";

const UnderLine = ({ className }: PropsWithClassName) => {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="91"
            height="9"
            fill="none"
            viewBox="0 0 91 9"
        >
            <path
                stroke="url(#paint0_linear_752_34662)"
                strokeWidth="1.5"
                d="M1 8l4.944-3.5a8.558 8.558 0 019.89 0v0a8.558 8.558 0 009.888 0v0a8.558 8.558 0 019.89 0v0a8.558 8.558 0 009.888 0v0a8.558 8.558 0 019.889 0v0a8.558 8.558 0 009.889 0v0a8.558 8.558 0 019.889 0v0a8.558 8.558 0 009.889 0L90 1"
            ></path>
            <defs>
                <linearGradient
                    id="paint0_linear_752_34662"
                    x1="9.521"
                    x2="119.713"
                    y1="1"
                    y2="19.887"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FF6E41"></stop>
                    <stop offset="1" stopColor="#FF41A8"></stop>
                </linearGradient>
            </defs>
        </svg>
    );
}

const Seperator = ({ className }: PropsWithClassName) => {
    return (
        <div className=" md:!w-[84px] w-auto h-[74px]  md:h-auto  relative">
            <svg
                className={cn("absolute  md:bottom-[25px] -translate-x-1/2 -translate-y-1  md:rotate-0 rotate-90    left-1/2 ",className)}
                xmlns="http://www.w3.org/2000/svg"
                width="78"
                height="85"
                fill="none"
                viewBox="0 0 78 85"
            >
                <path
                    fill="#fff"
                    d="M0 0l10.716 10.716c15.62 15.62 40.947 15.62 56.568 0L78 0v85l-9.659-10.424c-15.83-17.085-42.852-17.085-58.682 0L0 85V0z"
                ></path>
            </svg>
        </div>
    );
};


