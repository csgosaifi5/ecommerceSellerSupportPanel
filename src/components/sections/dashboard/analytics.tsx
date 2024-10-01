'use client';
import DateRangePicker from "@/components/ui/date-range-picker";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SelectField from "@/components/ui/select-group"
import { Separator } from "@/components/ui/separator"
import { useDashboardData } from "@/lib/react-query/user-query";
import dayjs from "dayjs";
import { Info } from "lucide-react";
import { useMemo, useState } from "react";


const options = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 days', value: 'last-7-days' },
    { label: 'Last 30 days', value: 'last-30-days' },
    { label: 'Last 90 days', value: 'last-90-days' },
    { label: 'Custom', value: 'custom' },
]

const AnalyticsSection = () => {
    const [filter, setFilter] = useState({
        startDate: dayjs().subtract(1, 'year').startOf('day').toDate(),
        endDate: dayjs().startOf('day').toDate(),
    });
    const { data, isSuccess } = useDashboardData(filter);

    const offer = data?.data.offers;
    const payout = data?.data.payout;
    const closureEfficiency = (offer?.closed / offer?.total * 100 )?? 0;

    const stats = useMemo(() => {
        const offer = data?.data.offers;

        console.log(offer);
        if (!isSuccess) return [];

        const stats = [];
        stats.push({
            "status": "Pending Shipment",
            "count": offer?.pendingShipment
        });

        stats.push({
            "status": "Delivered with Defects",
            "count": offer?.defects
        });

        stats.push({
            "status": "Draft",
            "count": offer?.draft
        });

        stats.push({
            "status": "Sent",
            "count": offer?.sent
        });

        stats.push({
            "status": "Not Approved",
            "count": offer?.notApproved
        });

        stats.push({
            "status": "Cancelled",
            "count": offer?.cancelled
        });

        return stats;
    }, [data, isSuccess]);

    const onDateRangeChange = (startDate?: Date, endDate?: Date) => {
        if (!startDate || !endDate)
            setFilter({ ...filter, startDate: dayjs().subtract(1, 'year').toDate(), endDate: dayjs().toDate() });
        else
            setFilter({ ...filter, startDate, endDate });
    }

    return (
        <div>
            <header className="flex justify-between items-end">
                <h2 className="text-xl font-semibold ">Analytics</h2>
                <DateRangePicker icon onValueChange={(range) => onDateRangeChange(range?.from, range?.to)} />
            </header>
            <div className="mt-4 mb-8 flex rounded-[30px] py-6 px-12 items-center justify-between gradient-secondary">
                <Anaylitic label="Total" value={`$ ${payout?.total ?? 0}`} />
                <Separator orientation="vertical" className="bg-white h-8" />
                <Anaylitic label="Earned" value={`$ ${payout?.earned ?? 0} `} />
                <Separator orientation="vertical" className="bg-white h-8" />
                <Anaylitic label="Pending" value={`$ ${payout?.remaining || 0}`} />
            </div>
            <Separator />
            <header className="flex mt-7 justify-between items-end">
                <h2 className="text-xl font-semibold ">Offers</h2>
            </header>

            <div className="flex gap-5">
                <div className="mt-4 flex-1 mb-8 flex rounded-[30px] py-6 px-8 items-center justify-between gradient-secondary">
                    <Anaylitic label="Total" value={offer?.total ?? 0} />
                    <Separator orientation="vertical" className="bg-white h-8" />
                    <Anaylitic label="Closed" value={offer?.closed ?? 0} />
                </div>
                <div className="mt-4 flex-1 mb-8 flex rounded-[30px] py-6 px-8 items-center justify-between gradient-secondary">
                    <div className="flex flex-col gap-1 w-fit  items-start justify-center">
                        <h3 className="text-sm font-medium flex gap-3">Closure efficiency
                            <HoverCard>
                                <HoverCardTrigger>       <Info size={20} className="text-gray-700" /></HoverCardTrigger>
                                <HoverCardContent side="top" className="bg-gray-800 text-nowrap border-none w-fit text-white">
                                Total offers closed / Total offers created
                                </HoverCardContent>
                            </HoverCard>

                        </h3>
                        <p className="text-xl font-semibold">{closureEfficiency.toFixed(2)} %</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 ">
                {stats.map((stat, index) => (
                    <StatPill key={index} label={stat.status} value={String(stat.count)} />
                ))}
            </div>

        </div>
    )
}

export default AnalyticsSection;

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

const StatPill = ({ label, value }: AnalyticsProps) => {

    return (
        <div className="flex border border-[#CABFFD] bg-white rounded-full w-234px py-2 px-4 justify-between items-center flex-shrink-0">
            <h3 className="text-sm font-medium">{label}</h3>
            <p className="text-xl font-semibold">{value}</p>
        </div>
    )
}