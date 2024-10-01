import AlertIcon from "@/components/icons/alert-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { useDeletePaymentMethod } from "@/lib/react-query/payment-methods-query";
import { PaymentMethod } from "@/models/payment-method";
import { useRef } from "react";

type Props = {
    paymentMethod: PaymentMethod;
    defaultOpen?: boolean;
}

const DeletePaymentMethod = ({ defaultOpen, paymentMethod }: Props) => {
    const { mutate, isPending } = useDeletePaymentMethod();
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const onDelete = () => {
        mutate(String(paymentMethod.id), {
            onSuccess: () => {
                closeButtonRef.current?.click();
            }
        });
    }

    return (
        <DialogContent>
            <DialogHeader className="items-center">
                <AlertIcon />
            </DialogHeader>
            <p className="text-gray-800 mb-5 md:mx-12 text-center">
                {`Are you sure you want to delete “${paymentMethod.label}” from payout preference ?`}
            </p>
            <DialogFooter>
                <div className="flex justify-center w-full gap-5">
                    <DialogClose asChild ref={closeButtonRef}>
                        <Button variant={'secondary'}>
                            Cancel
                        </Button>
                    </DialogClose>

                    <Button onClick={onDelete} disabled={isPending}>
                        {isPending ? "Deleting..." : "Confirm"}
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    );
}

export default DeletePaymentMethod;