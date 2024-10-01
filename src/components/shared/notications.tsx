import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  useGetNotifications,
  useUpdateNotification,
} from "@/lib/react-query/user-query";
import { use, useMemo } from "react";
import BoxIcon from "../icons/box-icon";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import UserNotification from "@/models/notification";
import Link from "next/link";

dayjs.extend(relativeTime);

const NoticationMenu = () => {
  const { data, isLoading, isSuccess } = useGetNotifications({
    start: 0,
    limit: 10,
  });

  const notifications = useMemo(() => {
    if (isSuccess) {
      let notifications = Array.from(data?.data?.data?.rows ?? []).map(
        (notification: any) => new UserNotification(notification)
      );

      notifications = notifications.sort((a, b) => {
        return a.createdAt < b.createdAt ? -1 : 1;
      });

      notifications = notifications.sort((a, b) => {
        return a.is_viewed ? 1 : -1;
      });

      return notifications;
    }

    return [];
  }, [data, isSuccess]);

  const unreadNotifications = useMemo(() => {
    return notifications.filter((notification) => !notification.is_viewed)
      .length;
  }, [notifications]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative">
        <Bell size={18} className="text-gray-700" />
        {unreadNotifications > 0 && (
          <div className="absolute -top-2 text-[12px] text-white flex justify-center items-center rounded-full w-5 h-5 bg-primary -right-2">
            {unreadNotifications}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-md sm:w-96 w-80  bg-white"
      >
        <header>
          <h2 className="border-b font-semibold text-gray-800 py-2 px-4">
            Notifications
          </h2>
        </header>
        <ScrollArea
          className={cn(
            "gap-2 py-4",
            notifications.length == 0 ? "h-40" : "h-fit",
            notifications.length > 3 && "h-80"
          )}
        >
          {isLoading && <Skeleton className="h-10" />}
          {isLoading && <Skeleton className="h-10" />}
          {isLoading && <Skeleton className="h-10" />}
          {isLoading && <Skeleton className="h-10" />}
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}

          {notifications.length === 0 && isSuccess && (
            <div className="text-gray-700 h-40 bg-gray-50 font-medium flex justify-center items-center">
              No New Notifications
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NoticationMenu;

type Props = {
  notification: UserNotification;
};

const NotificationCard = ({ notification }: Props) => {
  const { mutate } = useUpdateNotification();

  const readNotification = () => {
    mutate({
      id: notification.id,
      is_viewed: true,
    });
  };

  const forwardLink = useMemo(() => {
    //case insensitive check for message
    if (notification.notification?.match(/message/i))
      return `/messages?offer_id=${notification.offer_id}`;

    //case insensitive check for status
    if (notification.notification?.match(/status/i))
      return `/offers/edit/${notification.offer_id}?view=true`;

    return `/offers/edit/${notification.offer_id}?view=true`;
  }, [notification]);

  return (
    <div
      onClick={readNotification}
      className={cn(
        "p-2 border-b flex gap-4 items-center hover:bg-slate-50 last:border-none",
        notification.is_viewed ? "opacity-50" : ""
      )}
    >
      <span>
        <BoxIcon />
      </span>
      <div className="flex text-xs flex-col gap-px ">
        <p className=" font-semibold">
          Offer ID:
          <Link
            className="ml-2 inline-block hover:underline"
            href={forwardLink}
          >
            #{notification.offer_id}
          </Link>
        </p>
        <p className="font-medium  line-clamp-2 text-gray-800">
          {notification.notification}
        </p>
        <p className="text-gray-500">
          {dayjs(notification.createdAt).fromNow()}
        </p>
      </div>
      <img src="/images/icons/coin.png" className="w-12 h-12" alt="" />
    </div>
  );
};
