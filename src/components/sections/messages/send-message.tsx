import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/context/auth-context";
import { useSendMessage } from "@/lib/react-query/message-query";
import dayjs from "dayjs";
import { PaperclipIcon, SendHorizonal, X } from "lucide-react";
import { send } from "process";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  offer_id: string;
};

const SendMessage = ({ offer_id }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useSendMessage();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const { userDetails } = useAuthStore();

  const today = new Date();
  const date = dayjs(today).format("YYYY-MM-DD");
  const time = dayjs(today).format("HH:mm:ss");

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (message.length > 0 || file) {
      const payload = new FormData();
      payload.append("offer_id", offer_id);
      payload.append("seller_id", userDetails?.id?.toString() ?? "");
      payload.append("send_by", "seller");
      payload.append("send_date", date);
      payload.append("send_time", time);

      if (file) {
        payload.append("message", file);
        payload.append("type", "file");
      } else {
        payload.append("message", message);
        payload.append("type", "text");
      }
      mutate(payload, {
        onSuccess: () => {
          setMessage("");
          setFile(null);
        },
      });
    } else {
      toast.error("Message cannot be empty");
    }
  };

  return (
    <form
      onSubmit={sendMessage}
      className="mx-8 relative bg-white  my-4 rounded-full h-[52px]"
    >
      {file && (
        <div className="absolute -top-20 shadow-lgkk  bg-white right-0 p-4 rounded-lg border border-gray-400  z-50">
          <Button
            size={"sm"}
            onClick={() => {
              const dt = new DataTransfer();
              if (fileInputRef.current) fileInputRef.current.files = dt.files;
              setFile(null);
            }}
            className="absolute -top-2 -right-2 w-8 rounded-full h-8 p-1"
            variant="destructive"
          >
            <X size={18} />
          </Button>
          <span className="text-gray-900 text-sm">File: {file.name}</span>
          <br />
          <span className="text-gray-900 text-sm">
            Size: {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
      )}
      <Input
        ref={inputRef}
        value={message}
        disabled={isPending || Boolean(file)}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className=" h-[52px] rounded-full "
      />
      <div className="absolute top-2.5 flex gap-3 right-3">
        <Button
          type="button"
          variant={"ghost"}
          onClick={(e) => {
            e.preventDefault();
            fileInputRef.current?.click();
          }}
          className="rounded-full w-8 h-8"
          size={"icon"}
        >
          <PaperclipIcon size={18} />
        </Button>
        <input
          type="file"
          className="invisible w-0 h-0"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <Button
          variant={"default"}
          disabled={isPending}
          onClick={sendMessage}
          className="rounded-full w-8 h-8"
          size={"icon"}
        >
          <SendHorizonal className="text-white" size={18} />
        </Button>
      </div>
    </form>
  );
};

export default SendMessage;
