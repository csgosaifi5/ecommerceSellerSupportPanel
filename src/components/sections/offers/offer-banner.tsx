'use client'
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { OfferFormValues } from "./form/offer-form";
import { useAuthStore } from "@/context/auth-context";
import { capitalizeFirstLetter } from "@/lib/utils";

type Props = {
    offer: OfferFormValues;
}

const OfferBanner = () => {
    const [showBanner, setShowBanner] = useState(true);
    const {userDetails} = useAuthStore();

    if (!showBanner) {
        return null;
    }
    return (
        <section className="container-main pb-6">
            <div className="bg-cover min-h-[60px]  flex md:px-16 px-4 py-2 justify-between items-center relative banner-gradient-bg rounded-b-[30px]">
                <img src='/images/illustrations/banner-bg.svg' className="absolute w-full object-cover h-full z-0 top-0 left-0  " alt="" />

                <p className="font-semibold relative z-10 sm:text-[15px] text-sm">
                    {` Welcome, ${capitalizeFirstLetter(userDetails?.first_name||"User")}! Please list only brand new products to uphold our marketplace's quality standards.`}
                </p>
                <Button onClick={() => setShowBanner(false)} size={'icon'} className="relative z-10" variant={'ghost'}>
                    <X size={20} />
                </Button>
            </div>
        </section>
    )
};

export default OfferBanner;
