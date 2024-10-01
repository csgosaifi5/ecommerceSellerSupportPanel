import { Button } from "@/components/ui/button";
import { DialogClose, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Edit, Pencil, X } from "lucide-react";
import { PropsWithChildren, useEffect, useState } from "react";
import { DowloadButton } from "../label-pdf";
import { useAuthStore } from "@/context/auth-context";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormProvider from "@/components/ui/form/FormProvider";
import { useAdminAddress } from "@/lib/react-query/user-query";
import { Textarea } from "@/components/ui/textarea";
import { useGetShippingDetails } from "@/lib/react-query/guest-query";

const shippinLabelSchema = z.object({
    weight: z.string().min(0).max(100),
    weighInOz: z.string().min(0).max(100),
    toAddress: z.string(),
    fromAddress: z.string(),
    dimensions: z.object({
        mesurement: z.enum(['inch', 'cm', 'm']),
        length: z.number().min(0).max(100),
        width: z.number().min(0).max(100),
        height: z.number().min(0).max(100),
    })
});

export type ShippingLabel = z.infer<typeof shippinLabelSchema>;

const ShippingDetailsForm = () => {
    const { userDetails } = useAuthStore();
    const [editFromAddress, setEditFromAddress] = useState(false);
    const { data, isSuccess } = useGetShippingDetails();
    const userAddress = `${userDetails?.address_1}, ${userDetails?.address_2} ${userDetails?.address_3} ${userDetails?.city}, ${userDetails?.country}, ${userDetails?.zipcode}`;

    const form = useForm<ShippingLabel>({
        resolver: zodResolver(shippinLabelSchema),
        defaultValues: {
            weight: "0",
            weighInOz: "0",
            toAddress: "",
            fromAddress: userAddress,
            dimensions: {
                mesurement: 'inch',
                length: 0,
                width: 0,
                height: 0
            }
        }
    });
    const shippingDetails = form.watch();

    useEffect(() => {

        if (isSuccess) {
            const shippingdetails = data?.data.data[0];
            const address = `${shippingdetails.first_name} ${shippingdetails.last_name},
            ${shippingdetails.street_address} ${shippingdetails.city} ${shippingdetails.state}, 
            ${shippingdetails.country}, ${shippingdetails.postal_code} `;
            form.setValue('toAddress', address);
        }
    }, [isSuccess, data]);

    /*  useEffect(() => {
         //oz to lbs
         const weight = Number(shippingDetails.weighInOz) / 16;
         form.setValue('weight', weight.toFixed(2));
 
     }, [shippingDetails.weighInOz]);
 
     useEffect(() => {
         //lbs to oz
         const weight = Number(shippingDetails.weight) * 16;
         form.setValue('weighInOz', weight.toFixed(2));
 
     }, [shippingDetails.weight]); */




    return (
        <>
            <DialogHeader>
                <h2 className="text-xl font-semibold">Generate Shipping Label</h2>
            </DialogHeader>
            <FormProvider methods={form} onSubmit={form.handleSubmit(() => { })}>
                <main className="mt-4 mb-8 flex gap-5 ">
                    <div className="flex-1 min-h-44 bg-[#F3F4F6] rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">
                                From Address
                            </h3>
                            <Button variant={'ghost'} onClick={() => setEditFromAddress((prev) => !prev)}>
                                {!editFromAddress ?
                                    <Pencil size={18} className="mr-2" /> :
                                    <X size={18} className="mr-2" />}
                                {editFromAddress ? 'Cancel' : 'Edit'}
                            </Button>
                        </div>
                        {!editFromAddress && <address className="not-italic mt-8">
                            {shippingDetails.fromAddress}
                        </address>}
                        {editFromAddress && <Textarea className="mt-8" {...form.register('fromAddress')} />}
                    </div>
                    <div className="flex-1 min-h-44 bg-[#F3F4F6] rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">
                                To Address
                            </h3>
                        </div>
                        <address className="not-italic mt-8">
                            {shippingDetails.toAddress}
                        </address>
                    </div>
                </main>
                <div>
                    <div className="space-y-1">
                        <Label>
                            Weight
                        </Label>
                        <div className="flex gap-5 flex-col md:flex-row">
                            <div className="relative flex-1">
                                <Input {...form.register('weight')} placeholder="Enter weight" />
                                <span className="border-l absolute flex justify-start items-center right-0 top-0 h-full w-28 px-4">
                                    lbs
                                </span>
                            </div>
                            <div className="relative flex-1">
                                <Input {...form.register('weighInOz')} placeholder="Enter weight" />
                                <span className="border-l absolute flex justify-start items-center right-0 top-0 h-full w-28 px-4">
                                    oz
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <h2 className="text-xl mb-4 font-semibold">Dimensions</h2>
                        <div className="flex gap-4">
                            <DimensionInput label="Length" name="dimensions.length" />
                            <DimensionInput label="Width" name="dimensions.width" />
                            <DimensionInput label="Height" name="dimensions.height" />
                        </div>
                    </div>
                    <footer className="mt-8 gap-4 justify-end flex">
                        <DialogClose asChild>
                            <Button variant={'secondary'}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <DowloadButton shippingDetails={shippingDetails} />
                    </footer>
                </div>
            </FormProvider>
        </>
    );
};

export default ShippingDetailsForm;

export const ShippingDetailsDialog = ({ children }: PropsWithChildren) => {
    return (
        <>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
        </>
    );
}


const DimensionInput = ({ label, name }: {
    label: string,
    name: any,
}) => {
    const { setValue, register, watch } = useFormContext<ShippingLabel>();
    const { dimensions } = watch();

    return (
        <div className="relative flex-1">
            <Label className="font-medium ">
                {label}
            </Label>
            <div className="relative mt-1">
                <Input  {...register(name)} placeholder="Enter weight" />
                <Select onValueChange={(value: any) => setValue('dimensions.mesurement', value)} >
                    <SelectTrigger className="border-l rounded-l-none absolute h-full w-28 right-0 top-0">
                        {dimensions.mesurement}
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cm">
                            Centimeter
                        </SelectItem>
                        <SelectItem value="inch">
                            Inch
                        </SelectItem>
                        <SelectItem value="m">
                            Meter
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )

};