import { ScrollArea } from "@/components/ui/scroll-area";
import ChatHeader from "./chat-header";
import { cn } from "@/lib/utils";
import { useGetAllMessages } from "@/lib/react-query/message-query";
import { useMemo } from "react";
import { OfferMessage } from "@/models/message";
import SendMessage from "./send-message";
import useMessageSelection from "@/hooks/message-filter";
import { Download, DownloadCloudIcon, FileIcon } from "lucide-react";

type Props = {
  offer_id?: string;
};

const ChatScreen = ({ offer_id: default_id }: Props) => {
  const { selectedOffer } = useMessageSelection();

  const offer_id = default_id || selectedOffer;
  const { data, isSuccess, isLoading } = useGetAllMessages({
    id: String(offer_id),
    markRead: true,
    sortBy: { send_date: "asc", send_time: "asc" },
  });

  const messages = useMemo(() => {
    if (isSuccess) {
      return Array.from(data.data).map(
        (message: any) => new OfferMessage(message)
      );
    }
    return [];
  }, [data, isSuccess, isLoading]);

  if (!offer_id || offer_id == "null")
    return (
      <div className="flex items-center bg-slate-200 justify-center h-full">
        <span className="text-gray800 font-medium text-lg">
          Select a message to view
        </span>
      </div>
    );

  return (
    <div>
      <ChatHeader offer_id={offer_id} />
      <ScrollArea className="h-[calc(100vh-300px)] grid gap-y-2">
        {messages.length === 0 && <NoMessages />}
        {messages.map((message, i) => (
          <ChatMessage key={i} message={message} />
        ))}
      </ScrollArea>
      <hr />
      <SendMessage offer_id={offer_id} />
    </div>
  );
};

type ChatProps = {
  message: OfferMessage;
};

const ChatMessage = ({ message }: ChatProps) => {
  return (
    <div
      className={cn(
        "flex flex-col w-full py-4 px-2 ",
        message.sender ? "items-end" : "items-start"
      )}
    >
      {message.fileType == "Text" && (
        <div
          className={cn(
            "p-2 rounded-xl shadow-sm max-w-md ",
            message.sender
              ? "bg-[#E8E7E7] text-[#333] rounded-br-none"
              : "bg-white text-[#333] rounded-bl-none"
          )}
        >
          {message.message}
        </div>
      )}

        {message.fileType == "File" && (
            <div
            className={cn(
                "p-2 rounded-xl shadow-sm max-w-md ",
                message.sender
                ? "bg-[#E8E7E7] text-[#333] rounded-br-none"
                : "bg-white text-[#333] rounded-bl-none"
            )}
            >
            <div className="flex items-center gap-4">
                <div className="bg-blue-100 rounded-md mr-2">
                <FileIcon size={20} className="text-blue-600" />
                </div>

                <span className="text-gray800 font-medium truncate">{message.fileName}</span>
                <a href={message ? message.message : ""} target="_blank" download={message.message} className="text-blue-500 bg-blue-50 rounded-sm p-2 underline">
                    <Download size={18}/>
                </a>
            </div>
            </div>
        )}

        {
            message.fileType == "Image" && (
                <div
                className={cn(
                    "p-2 rounded-xl shadow-sm max-w-md ",
                    message.sender
                    ? "bg-[#E8E7E7] text-[#333] rounded-br-none"
                    : "bg-white text-[#333] rounded-bl-none"
                )}
                >
                <div className="flex items-center h-32 ">
                    <img src={message.message} className="h-full rounded-sm w-auto object-contain" alt="image" />
                </div>
                </div>
            )
        }

        {
            message.fileType == "Video" && (
                <div
                className={cn(
                    "p-2 rounded-xl shadow-sm max-w-md ",
                    message.sender
                    ? "bg-[#E8E7E7] text-[#333] rounded-br-none"
                    : "bg-white text-[#333] rounded-bl-none"
                )}
                >
                <div className="flex items-center">
                    <video src={message.message} controls />
                </div>
                </div>
            )
        }


      <div
        className={cn(
          "text-sm text-[#AFB8CF] mt-2",
          message.sender ? "justify-end" : "justify-start"
        )}
      >
        {message.time}
      </div>
    </div>
  );
};

const NoMessages = () => {
  return (
    <div className="flex items-center py-8 bg-slate-200 justify-center h-full">
      <span className="text-gray800 font-medium ">No messages yet</span>
    </div>
  );
};

export default ChatScreen;
