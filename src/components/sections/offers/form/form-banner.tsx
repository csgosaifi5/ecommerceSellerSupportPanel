import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { EllipsisVertical } from "lucide-react";
import { OfferFormValues } from "./offer-form";
import StatusBadge from "@/components/shared/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ShippingDetailsForm, { ShippingDetailsDialog } from "./shipping-details";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OfferProvider } from "@/hooks/offer-hook";
import {
  useCloneOffer,
  useDeleteOffer,
  useDownloadPdf,
  useUpdateOffer,
} from "@/lib/react-query/offer-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";
import TrackingForm from "./tracking-form";

type Props = {
  className?: string;
  offer?: OfferFormValues;
};

const OfferFormBanner = ({ className, offer }: Props) => {
  const id = offer?.id;
  const router = useRouter();
  const [dialog, setDialog] = useState<"tracking" | "shipping-details">(
    "tracking"
  );

  const { mutate: deleteOffer, isPending: deleting } = useDeleteOffer();
  const { mutate: cloneOffer, isPending: cloning } = useCloneOffer();
  const { mutate: updateOffer, isPending: updatingOffer } = useUpdateOffer();
  const { mutate: downloadPdf, isPending: downloadingPdf } = useDownloadPdf();

  const handleCloning = () => {
    cloneOffer(offer?.id!, {
      onSuccess: (data) => {
        toast.success(data.data.message);
        router.push(`/offers`);
      },
      onError: (error) => {
        toast.error("Failed to clone offer");
      },
    });
  };

  const handleDeleting = () => {
    deleteOffer(offer?.id!, {
      onSuccess: (data) => {
        toast.success(data.data.message);
        router.push(`/offers/`);
      },
      onError: (error) => {
        toast.error("Failed to delete offer");
      },
    });
  };

  const handleUpdate = () => {

    if(offer?.offer_status == "shipped" ){
      toast.error("Offer is already shipped");
      return;
    }
    if (offer?.offer_status !== "approved" ) {
      toast.error("Offer is not approved yet");
      return;
    }
    updateOffer(
      { id: offer?.id, offer_status: "shipped" },
      {
        onSuccess: (data) => {
          toast.success(data.data.message);
        },
        onError: (error) => {
          toast.error("Failed to update offer");
        },
      }
    );
  };

  const handleDownloadPdf = () => {
    downloadPdf(offer?.id!, {
      onSuccess: (data) => {
        const link = data.data.data;
        const a = document.createElement("a");
        a.href = link;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      onError: (error) => {
        console.log(error);
        toast.error("Failed to download pdf");
      },
    });
  };

  const isApproved = offer?.offer_status !== "draft" && offer?.offer_status !== "sent";

  return (
    <div
      className={cn(
        "bg-[#E9E9E9] flex items-center flex-wrap  min-h-[60px] rounded-2xl py-3 px-4",
        className
      )}
    >
      <h2 className="font-semibold text-[22px] text-[#333]">
        {!offer ? "Create offer" : `Offer - ${id}`}
      </h2>
      <Separator className="mx-5 bg-[#ABABAB] h-4" orientation="vertical" />
      <span>Created on: </span>
      <span className="font-semibold">
        &nbsp;{dayjs().format("DD-MMM-YYYY")}
      </span>

      <div className="md:ml-auto flex gap-5 justify-center items-center">
        {offer && <StatusBadge status={offer.offer_status} />}
        <Dialog>
        {  offer && <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical size={18} className=" p-px rounded-full" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isApproved && (
                <>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onClick={() => setDialog("tracking")}>
                      Update Tracking Details
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onClick={() => setDialog("shipping-details")}
                    >
                      Generate shipping label
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuItem
                    onClick={handleDownloadPdf}
                    disabled={downloadingPdf}
                  >
                    {downloadingPdf ? "Downloading..." : "Preview and Download"}
                  </DropdownMenuItem>
                 { <DropdownMenuItem
                    disabled={updatingOffer}
                    onClick={handleUpdate}
                  >
                    {updatingOffer ? "Updating..." : "Mark as Shipped"}
                  </DropdownMenuItem>}
                </>
              )}
              <DropdownMenuItem disabled={cloning} onClick={handleCloning}>
                {cloning ? "Cloning..." : "Clone"}
              </DropdownMenuItem>
              <DropdownMenuItem disabled={deleting} onClick={handleDeleting}>
                {deleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>}
          {isApproved && dialog == "shipping-details" && (
            <DialogContent className="max-w-4xl">
              <OfferProvider offer={offer as any}>
                <ShippingDetailsForm />
              </OfferProvider>
            </DialogContent>
          )}
          {dialog == "tracking" && (
            <DialogContent className="max-w-3xl">
              <TrackingForm offer_id={offer?.id!} />
            </DialogContent>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export default OfferFormBanner;
