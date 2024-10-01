import { usePathname, useRouter, useSearchParams } from "next/navigation";

const useMessageSelection = () => {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const selectedOffer = String(params.get('offer_id')) || '';

    const setSelectedOffer = (offer_id: string) => {
        router.push(`${pathname}?offer_id=${offer_id}`);
    }

    return { selectedOffer, setSelectedOffer };
}

export default useMessageSelection;