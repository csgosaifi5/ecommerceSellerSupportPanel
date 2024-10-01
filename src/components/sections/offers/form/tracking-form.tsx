import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import FormInput from "@/components/ui/form/FormInput";
import FormProvider from "@/components/ui/form/FormProvider";
import FormGroupSelect from "@/components/ui/form/form-select";
import {
  useUpsertTrackingDetails,
  useGetOfferById,
  useGetTrackingDetails,
  useUpdateOffer,
} from "@/lib/react-query/offer-query";
import { fileToBase64 } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Fragment, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const trackingSchema = z.object({
  tracking_id: z.number().optional(),
  shipment_company: z.string().min(1, "required"),
  tracking_num: z
    .string().min(1, "required"),
  tracking_url: z.string().min(1, "required").url(),
});

const tracking_details = z.object({
  tracking_details: z.array(trackingSchema),
});

type TrackingFormValues = z.infer<typeof tracking_details>;

type Props = {
  offer_id: number;
};

const shipmentCompanies = [
  { value: "UPS", label: "UPS (United Parcel Service)" },
  { value: "FedEx", label: "FedEx (Federal Express)" },
  { value: "USPS", label: "USPS (United States Postal Service)" },
  { value: "DHL", label: "DHL (DHL Express)" },
  { value: "Amazon Logistics", label: "Amazon Logistics" },
  { value: "OnTrac", label: "OnTrac" },
  { value: "XPO Logistics", label: "XPO Logistics" },
  { value: "Estes Express Lines", label: "Estes Express Lines" },
  { value: "Old Dominion Freight Line", label: "Old Dominion Freight Line" },
  { value: "YRC Freight", label: "YRC Freight" },
];

const TrackingForm = ({ offer_id }: Props) => {
  const { data, isLoading, isSuccess } = useGetTrackingDetails(
    offer_id.toString()
  );
  const form = useForm<TrackingFormValues>({
    resolver: zodResolver(tracking_details),
    defaultValues: {
      tracking_details: [
        {
          shipment_company: "",
          tracking_num: "",
          tracking_url: "",
        },
      ],
    },
  });

  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: "tracking_details",
  });

  const { mutate, isPending } = useUpsertTrackingDetails();

  useEffect(() => {
    if (isSuccess) {
      const trackingDetails = data.data.data;
      const formValues = trackingDetails.map((tracking: any) => ({
        shipment_company: tracking.shipment_company,
        tracking_num: tracking.tracking_num,
        tracking_id: tracking.id,
        tracking_url: tracking.tracking_url,
      }));

      form.reset({
        tracking_details: formValues,
      });
    }
  }, [isSuccess]);

  const onSubmit = form.handleSubmit((data: TrackingFormValues) => {
    const payload = data.tracking_details.map((tracking) => {
      const tracking_detail: any = {
        shipment_company: tracking.shipment_company,
        tracking_num: tracking.tracking_num,
        tracking_url: tracking.tracking_url,
        offer_id: offer_id,
      };

      if (tracking.tracking_id) {
        tracking_detail.id = tracking.tracking_id;
      }
      return tracking_detail;
    });
    mutate({ offer_id, items: payload });
  });

  const addNewTracking = () => {
    append({
      shipment_company: "",
      tracking_num: "",
      tracking_url: "",
    });
  };

  return (
    <Fragment>
      <DialogHeader className="text-lg mb-4 font-semibold">
        Update Tracking Details
      </DialogHeader>
      <FormProvider onSubmit={onSubmit} methods={form}>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-4 items-start">
            <div className="md:grid-cols-2 flex-1 p-4 border rounded-xl grid gap-4 ">
              <FormInput
                control={form.control}
                name={`tracking_details.${index}.tracking_num`}
                label="Tracking Number"
              />
              <FormGroupSelect
                options={shipmentCompanies}
                control={form.control}
                name={`tracking_details.${index}.shipment_company`}
                label="Shippment Company"
              />
              <FormInput
                control={form.control}
                name={`tracking_details.${index}.tracking_url`}
                label="Tracking URL"
              />
              <div />
            </div>
            <Button
              type="button"
              onClick={() => remove(index)}
              variant={"ghost"}
            >
              <X size={20} />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant={"ghost"}
          onClick={addNewTracking}
          className="text-primary px-0"
        >
          Add Another Track Package
        </Button>
        <footer className="flex justify-end md:col-span-2 gap-4 mt-8">
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update"}
          </Button>
        </footer>
      </FormProvider>
    </Fragment>
  );
};

export default TrackingForm;
