'use client';
import PayoutStatsSection from "@/components/sections/payout/analytics"
import OfferPayoutTable from "@/components/sections/payout/offer-table";
import PayoutTable from "@/components/sections/payout/payout-table";
import DateRangePicker from "@/components/ui/date-range-picker";
import { Label } from "@/components/ui/label";
import SelectField from "@/components/ui/select-group";
import { useGetPaymentMethods } from "@/lib/react-query/payment-methods-query";
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const statusOptions = [
    {
        label: "All",
        value: "all",
    },
    {
        label: "Delivered",
        value: "delivered",
    },
    {
        label: "Closed",
        value: "closed",
    },
];

const sortingOptions = [
    {
        "label": "Newest first",
        "value": "newest-first"
    },
    {
        "label": "Oldest first",
        "value": "oldest-first"
    },
    {
        "label": "Highest to Lowest Payout",
        "value": "highest-to-lowest"
    },
    {
        "label": "Lowest to Highest Payout",
        "value": "lowest-to-highest"
    }
]; 

const PayoutPage = () => {
    const { data, isSuccess } = useGetPaymentMethods();

    const [filter, setFilter] = useState({
        startDate: dayjs().subtract(1, 'year').startOf('day').toDate(),
        endDate: dayjs().startOf('day').toDate(),
    });

    const router = useRouter();
    const pathname = usePathname();

    const onDateRangeChange = (startDate?: Date, endDate?: Date) => {
        if (!startDate || !endDate)
            setFilter({ ...filter, startDate: dayjs().subtract(1, 'year').toDate(), endDate: dayjs().toDate() });
        else
            setFilter({ ...filter, startDate, endDate });
    };

    const paymentMethods = useMemo(() => {
        if (!isSuccess) return [{
            label: "All",
            value: "all",
        }];
        const options = Array.from(data.data.data).map((method: any) => ({
            label: method.label??method.platform,
            value: method.id
        }));

        options.unshift({
            label: "All",
            value: "all",
        });

        return options;
    }, [isSuccess, data]);

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(window.location.search);

        if (value === 'all') {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <section className="container-main py-10">
            <header className="flex justify-between mb-4 px-2 items-end">
                <h2 className="text-xl font-semibold ">Analytics</h2>
                <DateRangePicker icon onValueChange={(range) => onDateRangeChange(range?.from, range?.to)} />
            </header>
            <PayoutStatsSection />
            <div className="flex gap-2 flex-wrap px-1 pt-4">
                <div>
                    <Label className="mb-2 block">
                        Status
                    </Label>
                    <SelectField onValueChange={(value) => handleFilterChange('status', value)} defaultValue="all" options={statusOptions} />
                </div>
                <div>
                    <Label className="mb-2 block">
                        Payment Method
                    </Label>
                    <SelectField
                        onValueChange={(value) => handleFilterChange('payment_methods', value)}
                        defaultValue="all" options={paymentMethods} />
                </div>
                <div className=" md:ml-auto">
                    <Label className="mb-2 block">
                        Sort by
                    </Label>
                    <SelectField
                        className="w-[220px]"
                        onValueChange={(value) => handleFilterChange('sort', value)}
                        defaultValue="newest-first"
                        options={sortingOptions} />
                </div>
            </div>
            <OfferPayoutTable />
        </section>
    )
}

export default PayoutPage;