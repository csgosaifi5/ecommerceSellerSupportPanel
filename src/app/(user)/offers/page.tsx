import OfferBanner from "@/components/sections/offers/offer-banner";
import OfferTable from "@/components/sections/offers/offer-table";
import ClientOnly from "@/components/ui/client-only";

const OffersPage = () => {
    return (
        <>
            <OfferBanner />
            <ClientOnly>
                <OfferTable />
            </ClientOnly>
        </>
    )

};

export default OffersPage;