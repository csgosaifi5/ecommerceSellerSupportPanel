'use client';
import { addDays, format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import * as React from 'react';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

type DateRangePickerProps = {
    selectoption?: boolean;
    icon?: boolean;
    showSeparete?: boolean;
    onValueChange?: (selectedRange: DateRange | undefined) => void;
} & React.HTMLAttributes<HTMLDivElement>;

function DateRangePicker({
    className,
    selectoption = true,
    icon = false,
    showSeparete = false,
    defaultValue,
    onValueChange,
}: DateRangePickerProps) {

    const [date, setDate] = useState<DateRange | undefined>({
        to: dayjs().endOf('day').toDate(),
        from: dayjs().subtract(1, 'year').startOf('day').toDate(),
    });

    const [select, setSelect] = useState<string>(defaultValue ? String(defaultValue) : 'last-1-year');

    useEffect(() => {
        if (onValueChange) {
            onValueChange(date);
        }
    }, [date]);

    // ...

    useEffect(() => {
        switch (select) {
            case 'last-7-days':
                setDate({
                    from: dayjs().subtract(6, 'day').startOf('day').toDate(),
                    to: dayjs().endOf('day').toDate(),
                });
                break;
            case 'last-1-month':
                setDate({
                    from: dayjs().subtract(1, 'month').startOf('day').toDate(),
                    to: dayjs().endOf('day').toDate(),
                });
                break;
            case 'last-3-month':
                setDate({
                    from: dayjs().subtract(3, 'month').startOf('day').toDate(),
                    to: dayjs().endOf('day').toDate(),
                });
                break;
            case 'last-1-year':
                setDate({
                    from: dayjs().subtract(1, 'year').startOf('day').toDate(),
                    to: dayjs().endOf('day').toDate(),
                });
                break;
            case 'lifetime':
                setDate(undefined);
                break;
            default:
                // Keep the current date range for custom selection
                break;
        }
    }, [select]);

    return (
        <div
            className={cn(
                'flex gap-0.5 border items-center flex-row-reverse bg-white dark:text-white dark:border-gray-600 rounded-md w-max',
                showSeparete ? 'border-none gap-1.5' : '',
                className
            )}
        >
            {selectoption ? (
                <>
                    <Select defaultValue={select} onValueChange={setSelect}>
                        <SelectTrigger
                            className={cn('w-fit   whitespace-nowrap', showSeparete ? 'border' : 'border-none')}
                        >
                           {icon&&<Clock size={18} className="mr-2 text-gray-700" />}
                            <SelectValue placeholder="Last 7 Days" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="last-7-days">Last 7 days</SelectItem>
                            <SelectItem value="last-1-month">Last 1 month</SelectItem>
                            <SelectItem value="last-3-month">Last 3 months</SelectItem>
                            <SelectItem value="last-1-year">Last 1 year</SelectItem>
                            <SelectItem value="lifetime">Lifetime</SelectItem>
                            <SelectItem value="custom">Custom </SelectItem>
                        </SelectContent>
                    </Select>
                    <Separator orientation='vertical' />
                </>
            ) : null}
          {select=='custom'&& <Popover>
                <PopoverTrigger disabled={select !== 'custom'} asChild>
                    <Button
                        id="date"
                        variant={'outline'}
                        className={cn(
                            'w-[165px] justify-start text-left font-normal whitespace-nowrap',
                            !date && 'text-muted-foreground',
                            showSeparete ? 'border' : 'border-none'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'LLL dd')} - {format(date.to, 'LLL dd')}
                                </>
                            ) : (
                                format(date.from, 'LLL dd, y')
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        numberOfMonths={2}
                        selected={date}
                        onSelect={setDate}
                    />
                </PopoverContent>
            </Popover>}
        </div>
    );
}

export default DateRangePicker;
