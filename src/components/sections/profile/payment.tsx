import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSubContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGetPaymentMethods, useUpdatePaymentMethod } from "@/lib/react-query/payment-methods-query";
import { PaymentMethod } from "@/models/payment-method";
import { ClipboardSignature, EclipseIcon, EllipsisVerticalIcon } from "lucide-react";
import { Fragment, Key, PropsWithChildren, useMemo, useState } from "react";
import DeletePaymentMethod from "./delete-payment";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import EditPaymentDialog from "./edit-payment";

const PaymentMethods = () => {
    const { data, isSuccess, isLoading } = useGetPaymentMethods();

    const paymentMethods = useMemo(() => {
        if (!isSuccess) return [];
        return Array.from(data.data.data).map((paymentMethod: any) => new PaymentMethod(paymentMethod));
    }, [data, isSuccess]);

    return (
        <div className="grid md:grid-cols-2 gap-5 py-8 grid-cols-1">
            {paymentMethods.map((method, i: number) => (
                <PaymentCard paymentMethod={method} key={i} />
            ))}
            {isLoading && <Skeleton className="flex flex-col h-52 md:col-span-2 col-span-1 items-center justify-center gap-4" />}
            {paymentMethods.length === 0 && !isLoading && <div className="flex flex-col h-52 md:col-span-2 col-span-1 items-center justify-center gap-4">
                Currently you have no payout preferences set
            </div>}

        </div>
    );
};
export default PaymentMethods;

type Props = {
    paymentMethod: PaymentMethod;
};
const PaymentCard = ({ paymentMethod }: Props) => {
    const imageUrl = useMemo(() => {
        switch (paymentMethod.platform) {
            case "cash-app":
                return "/images/icons/cash-app.png";
            case "paypal":
                return "/images/icons/paypal.png";
            case "venmo":
                return "/images/icons/venmo.png";
            case "zelle":
                return "/images/icons/zelle.png";
            default:
                return "";
        }
    }, [paymentMethod.platform]);
    return (
        <div className="py-2.5 px-[22px] flex gap-x-[18px] rounded-[20px] h-28 border- bg-white">
            <div className="w-[78px] flex items-center justify-center rounded-2xl bg-[#F5F5F5]">
                <img src={imageUrl} alt="" />
            </div>

            <div className="flex justify-around py-2 flex-col h-full">
                <p className="font-medium">{paymentMethod.label}</p>
                <p>{paymentMethod.details}</p>
                <p className="text-[#8a8a8a] text-sm">{paymentMethod.platform}</p>
            </div>
            <div className="flex flex-col items-end h-full justify-between ml-auto">
                <DropDownMenu paymentMethod={paymentMethod} />
                {paymentMethod.default_method && <Badge variant={'secondary'}>Default</Badge>}
            </div>
        </div>
    );

};

const DropDownMenu = ({ paymentMethod }: { paymentMethod: PaymentMethod }) => {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const { mutate, isPending } = useUpdatePaymentMethod();

    const markAsDefault = () => {
        mutate({ ...paymentMethod, default_method: true });
    }

    return (
        <Fragment>
            <Dialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size={'icon'} variant={'ghost'}>
                            <EllipsisVerticalIcon size={20} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                        <DialogTrigger asChild>
                            <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit Method</DropdownMenuItem>
                        </DialogTrigger>
                        {!paymentMethod.default_method && <DropdownMenuItem onClick={markAsDefault} disabled={isPending}>
                            Mark as Default
                        </DropdownMenuItem>}
                        <DialogTrigger asChild>
                            <DropdownMenuItem onClick={() => setDeleteOpen(true)}>Delete</DropdownMenuItem>
                        </DialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
                {editOpen && <EditPaymentDialog paymentMethod={paymentMethod} />}
                {deleteOpen && <DeletePaymentMethod paymentMethod={paymentMethod} />}
            </Dialog>
        </Fragment>
    );
}