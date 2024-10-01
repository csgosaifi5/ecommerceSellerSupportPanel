import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

type Filter = {
  status: string;
  payment: string;
  search: string;
  startDate: Date;
  endDate: Date;
  page: number;
};

const useOfferFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const filter = useMemo(() => {
    const status = params.get("status") || "all";
    const search = params.get("search") || "";

    const payment = params.get("payment") || "all";
    const startDate = params.get("startDate")
      ? new Date(params.get("startDate") as string)
      : dayjs().subtract(1, "year").toDate();
    const endDate = params.get("endDate")
      ? new Date(params.get("endDate") as string)
      : dayjs().toDate();
    const page = params.get("page") ? Number(params.get("page")) : 1;
    return { status, search, startDate, endDate, page, payment };
  }, [params]);

  const setFilter = (filter: Filter) => {
    router.push(
      `${pathname}?status=${filter.status}&search=${
        filter.search
      }&startDate=${filter.startDate.toISOString()}&endDate=${filter.endDate.toISOString()}&page=${
        filter.page
      }&payment=${filter.payment}`,
      { scroll: false }
    );
  };

  return { filter, setFilter };
};

export default useOfferFilter;
