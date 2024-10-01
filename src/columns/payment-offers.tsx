import PendingIcon from "@/components/icons/pending";
import StatusBadge from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import useOfferFilter from "@/hooks/offer-table-filter";
import { useCloneOffer, useDeleteOffer } from "@/lib/react-query/offer-query";
import { cn, isApproved } from "@/lib/utils";
import { Offer } from "@/models/offers";
import { offerStatusOptions } from "@/types/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import {
  CheckCircle2,
  EllipsisVertical,
  Filter,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const offerColumns: ColumnDef<Offer>[] = [
  {
    header: "ORDER ID",
    accessorKey: "orderId",
    cell: ({ row }) => (
      <Link href={`/offers/edit/${row.original.id}?view=true`}>
        <span className="text-primary font-semibold">{row.original.id}</span>
      </Link>
    ),
  },
  {
    header: "PRODUCT(S)",
    accessorKey: "products",
    cell: ({ row }) => <ProductColumn offer={row.original} />,
  },
  {
    header: "CREATE ON",
    accessorKey: "createon",
    cell: ({ row }) => (
      <span className="text-[#6B7280]">
        {dayjs(row.original.createdAt).format("DD-MM-YYYY")}
      </span>
    ),
  },
  {
    header: () => <OfferStatusHeader />,
    accessorKey: "offerstatus",
    cell: ({ row }) => <StatusColumn offer={row.original} />,
  },
  {
    header: "TOTAL",
    accessorKey: "total",
    cell: ({ row }) => (
      <span className="text-[#111928]">$ {row.original.total_price}</span>
    ),
  },
  {
    header: ({ column }) => <OfferPaymentHeader />,
    accessorKey: "payout",
    cell: ({ row }) => <PayoutColumn offer={row.original} />,
  },
  {
    header: "MESSAGES",
    accessorKey: "messages",
    cell: ({ row }) => (
      <Link href={`/messages?offer_id=${row.original.id}`}>
        <span
          className={cn(
            "flex gap-2",
            row.original.readCount > 0 ? "text-black" : "text-[#6B7280]"
          )}
        >
          <MessageCircle size={20} />
          {row.original.readCount > 0 ? row.original.readCount : ""}
        </span>
      </Link>
    ),
  },
  {
    header: "ACTIONS",
    accessorKey: "actions",
    cell: ({ row }) => <ActionColumn offer={row.original} />,
  },
];

export default offerColumns;

const OfferStatusHeader = () => {
  const { filter, setFilter } = useOfferFilter();

  const handleStatusChange = (status: string) => {
    setFilter({ ...filter, status: status, page: 1 });
  };

  return (
    <div className="flex uppercase items-center gap-2">
      <span>Offer Status</span>
      <Select defaultValue="all" onValueChange={handleStatusChange}>
        <SelectTrigger
          showChevron={false}
          className="bg-transparent border-none"
        >
          <Filter size={18} />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-40">
            {offerStatusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
};
const OfferPaymentHeader = () => {
  const { filter, setFilter } = useOfferFilter();
  const handlePaymentChange = (status: string) => {
    setFilter({ ...filter, payment: status as any, page: 1 });
  };

  return (
    <div className="flex uppercase items-center gap-2">
      <span>PAYOUT</span>
      <Select defaultValue="all" onValueChange={handlePaymentChange}>
        <SelectTrigger
          showChevron={false}
          className="bg-transparent border-none"
        >
          <Filter size={18} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="unpaid">Unpaid</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const StatusColumn = ({ offer }: { offer: Offer }) => {
  return <StatusBadge status={offer.offer_status} />;
};

const ActionColumn = ({ offer }: { offer: Offer }) => {
  const approved = isApproved(offer.offer_status);

  const { mutate: deleteOffer, isPending: deleting } = useDeleteOffer();
  const { mutate: cloneOffer, isPending: cloning } = useCloneOffer();

  const handleCloning = () => {
    cloneOffer(offer?.id!);
  };

  const handleDeleting = () => {
    deleteOffer(offer?.id!, {});
  };
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!approved && (
            <DropdownMenuItem asChild>
              <Link href={`/offers/edit/${offer.id}`}>Edit</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href={`/offers/edit/${offer.id}?view=true`}>View</Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled={cloning} onClick={handleCloning}>
            {cloning ? "Cloning..." : "Clone"}
          </DropdownMenuItem>
          {!approved && (<AlertDialogTrigger asChild>
            <DropdownMenuItem disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </AlertDialogTrigger>)}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            Offer and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant={"destructive"} onClick={handleDeleting}>
              Delete Offer
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const PayoutColumn = ({ offer }: { offer: Offer }) => {
  const status = String(offer.payment_status).toUpperCase();
  if (status === "PAID") {
    return <CheckCircle2 size={20} className="text-green-600" />;
  }
  if (status === "UNPAID") {
    return <PendingIcon />;
  }
  return "-";
};

const ProductColumn = ({ offer }: { offer: Offer }) => {
  const products = offer.products;
  if (products.length == 0) return "No Products Found";

  return (
    <div>
      {products[0]?.product_name || "No Product Name Found"}
      {products.length > 1 && (
        <Badge
          variant={"secondary"}
          className="ml-2 bg-transparent text-primary"
        >
          +{products.length - 1} more
        </Badge>
      )}
    </div>
  );
};
