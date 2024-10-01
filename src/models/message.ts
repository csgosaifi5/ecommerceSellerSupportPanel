import dayjs from "dayjs";

export class OfferMessage {
  id: number;
  offer_id: number;
  seller_id: number;
  send_by: string;
  type: "text" | "file";
  admin_id: number | null;
  message: string;
  send_date: string;
  send_time: string;
  is_read: boolean;
  user: string;

  get sender() {
    return this.send_by === "seller" ? true : false;
  }

  get time() {
    const date = dayjs(this.send_date).format("DD MMM,");
    const time = convertTimeTo12HourFormat(this.send_time);

    return `${date} ${time}`;
  }
  get fromNow() {
    const date = dayjs(this.send_date).fromNow();
    const time = convertTimeTo12HourFormat(this.send_time);

    return `${date} ${time}`;
  }

  get fileType() {
    if (this.type === "text") return "Text";

    const extension = this.message.split(".").pop();
    if (!extension) return "File";
    return getFileTypeFromExtension(extension);
  }

  get fileName() {
    if (this.type === "text") return "";

    const fileName = this.message.split("/").pop();
    return fileName ? fileName : "";
  }

  constructor(data: any) {
    this.id = data. id;
    this.offer_id = data.offer_id;
    this.seller_id = data.seller_id;
    this.send_by = data.send_by;
    this.admin_id = data.admin_id;
    this.message = data.message;
    this.send_date = data.send_date;
    this.type = data.type;
    this.send_time = data.send_time;
    this.is_read = data.is_read;
    this.user = data.user;
  }
}

function getFileTypeFromExtension(
  extension: string
): "Video" | "Image" | "File" {
  const extensionMap: { [key: string]: string } = {
    mp4: "Video",
    avi: "Video",
    mov: "Video",
    mkv: "Video",
    wmv: "Video",
    jpg: "Image",
    jpeg: "Image",
    png: "Image",
    gif: "Image",
    bmp: "Image",
    tiff: "Image",
    doc: "File",
    docx: "File",
    pdf: "File",
    txt: "File",
    xlsx: "File",
    pptx: "File",
    zip: "File",
    rar: "File",
  };

  const fileType = extensionMap[extension.toLowerCase()] as any;
  return fileType ? fileType : "File";
}

function convertTimeTo12HourFormat(time24: string): string {
  const [hourStr, minuteStr, secondStr] = time24
    .split(":")
    .map((str) => parseInt(str));
  const date = new Date(0, 0, 0, hourStr, minuteStr, secondStr);
  let hour = date.getHours();
  const amPm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");
  return `${hour}:${minute} ${amPm}`;
}

function createDateFromStrings(dateString: string, timeString: string) {
  // Split the date string into year, month, and day
  const [year, month, day] = dateString.split("-");

  // Split the time string into hours, minutes, and seconds
  const [hours, minutes, seconds] = timeString.split(":");

  // Create a new Date object with the extracted components
  const newDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    Number(seconds)
  );

  return newDate;
}
