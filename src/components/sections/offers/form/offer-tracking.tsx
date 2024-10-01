import { UseFormReturn } from "react-hook-form";
import { OfferFormValues } from "./offer-form";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import {
  useGetOfferById,
  useGetTrackingDetails,
} from "@/lib/react-query/offer-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import SelectField from "@/components/ui/select-group";
import LoadingScreen from "@/components/shared/loading-screen";

type Props = {
  className?: string;
  form: UseFormReturn<OfferFormValues>;
};

const TrackingPackage = ({ className, form }: Props) => {
  const id = form.getValues("id");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data, isLoading, isSuccess } = useGetTrackingDetails(id?.toString()!);

  const tracking_details = useMemo(() => {
    if (isSuccess) {
      const tracking_details = data?.data.data;
      return tracking_details;
    }
    return [];
  }, [data]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const tracking_details_options = useMemo(() => {
    const options = tracking_details.map((tracking: any) => ({
      value: tracking.id.toString(),
      label: tracking.tracking_num,
    }));
    if(options.length > 0)
    setSelectedId(Number(options[0].value));
    return options;
  }, [tracking_details]);

  const selectedDetails = useMemo(() => {
    return tracking_details.find((tracking: any) => tracking.id === selectedId);
  }, [selectedId, tracking_details]);

  if (isLoading) {
    return <LoadingScreen className="h-40" />;
  }

  if (!tracking_details.length) {
    return null;
  }

  return (
    <section className={cn("rounded-2xl grid bg-white p-[18px]", className)}>
      <Accordion type="multiple">
        <AccordionItem value="tracking" className=" border-none">
          <AccordionTrigger className=" flex justify-start [&[data-state=open]>svg]:rotate-90">
            <ChevronRight className="mr-2" />
            <span className="font-semibold">Tracking</span>
            <SelectField
              name="tracking"
              value={selectedId?.toString()}
              onValueChange={(value) => setSelectedId(Number(value))}
              className="ml-auto"
              options={tracking_details_options}
            />
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 text-gray-700 gap-3">
              <div className="font-medium">Carrier</div>
              <div className="text-gray-900">
                {selectedDetails?.shipment_company}
              </div>
              <div className="font-medium">Tracking Number</div>
              <div className="text-gray-900">
                {selectedDetails?.tracking_num}
              </div>
              <div className="font-medium">Tracking URL</div>
              <div>
                {selectedDetails?.tracking_url ?? ""}
                <Button
                  type="button"
                  size={"sm"}
                  variant="ghost"
                  onClick={() =>
                    copyToClipboard(selectedDetails?.tracking_url ?? "")
                  }
                >
                  <Copy size={18} />
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default TrackingPackage;
