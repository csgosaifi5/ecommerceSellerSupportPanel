import { useMemo } from "react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

const StatusBadge = ({ status }: { status: string }) => {
  const className = useMemo(() => {
    const offer_status = String(status).toUpperCase();
    if (offer_status === "DRAFT") return "bg-[#FDF6B2] text-[#723B13]";
    if (offer_status === "SENT") return "bg-[#EDEBFE] text-[#5521B5]";
    if (offer_status === "PENDING FOR SHIPPMENT")
      return "bg-[#DEF7EC] text-[#03543F]";
    if (offer_status === "SHIPPED") return "bg-[#DEF7EC] text-[#03543F]";
    if (offer_status === "CANCELLED") return "bg-[#FDE8E8] text-[#9B1C1C]";
    if (offer_status === "CLOSED") return "bg-[#FDE8E8] text-[#9B1C1C]";
    if (offer_status === "SENT FOR APPORVAL")
      return "bg-[#EDEBFE] text-[#5521B5]";
    if (offer_status === "APPROVED") return "bg-[#EDEBFE] text-[#5521B5]";
    if (offer_status === "DELIVERED WITH DEFECTS")
      return "bg-[#111928] text-[#111928]";
    if (offer_status === "REJECTED") return "bg-[#FDBA8C] text-[#723B13]";
    return "bg-gray-100 text-gray-800";
  }, [status]);
  const label = useMemo(() => {
    if (status === "sent") return "Sent for Approval";

    return status;
  }, [status]);

  return (
    <Badge
      className={cn(
        "h-fit capitalize flex justify-center w-fit px-4",
        className
      )}
    >
      {label || "None"}
    </Badge>
  );
};

export default StatusBadge;
