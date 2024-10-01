'use client';
import DateRangePicker from "@/components/ui/date-range-picker";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SelectField from "@/components/ui/select-group"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/lib/react-query/user-query";
import dayjs from "dayjs";
import { Info } from "lucide-react";
import { useMemo, useState } from "react";


const PayoutStatsSection = () => {
    const [filter, setFilter] = useState({
        startDate: dayjs().subtract(10, 'year').startOf('day').toDate(),
        endDate: dayjs().startOf('day').toDate(),
    });
    const { data, isSuccess, isLoading } = useDashboardData(filter);

    const payout = data?.data.payout;

    if (isLoading) return <Skeleton className="h-40 w-full" />;

    return (
        <div className=" p-6 bg-white rounded-[30px]">
            <div className="flex rounded-[30px] py-6 px-12 md:gap-12 sm:gap-8 gap-4 md:flex-row  flex-col md:w-fit w-full md:items-center justify-between gradient-secondary">
                <Anaylitic label="Total Payouts" value={`$ ${payout?.total ?? 0}`} />
                <Separator orientation="vertical" className="bg-white md:h-8 h-px w-full md:w-px" />
                <Anaylitic label="Received Payouts" value={`$ ${payout?.earned ?? 0} `} />
                <Separator orientation="vertical" className="bg-white md:h-8 h-px w-full md:w-px" />
                <Anaylitic label="Pending Payouts" value={`$ ${payout?.remaining || 0}`} />
            </div>
        </div>
    )
}

export default PayoutStatsSection;

type AnalyticsProps = {
    label: string;
    value: string;
}

const Anaylitic = ({ label, value }: AnalyticsProps) => {
    return (
        <div className="flex flex-col gap-1 w-fit  items-start justify-center">
            <h3 className="text-sm font-medium">{label}</h3>
            <p className="text-xl font-semibold">{value}</p>
        </div>
    )
}

