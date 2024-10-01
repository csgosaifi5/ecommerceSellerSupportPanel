import PaymentMethodForm from "@/components/forms/payment-method-form";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUpdatePaymentMethod } from "@/lib/react-query/payment-methods-query";
import { useRef } from "react";

type Props = {
    paymentMethod: any;
};

const EditPaymentDialog = ({ paymentMethod }: Props) => {
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const { mutate, isPending } = useUpdatePaymentMethod();
    const onSubmit = (data: any) => {
        mutate({ ...data, id: paymentMethod.id },{
            onSuccess: () => {
                closeButtonRef.current?.click();
            }
        });
    };

    const closeDialog = () => {
        closeButtonRef.current?.click();
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Edit Payment Method
                </DialogTitle>
            </DialogHeader>
            <PaymentMethodForm row isLoading={isPending} onSubmit={onSubmit} onCanceled={closeDialog} defaultValues={paymentMethod} />
            <DialogClose ref={closeButtonRef} />
        </DialogContent>
    );
}

export default EditPaymentDialog;