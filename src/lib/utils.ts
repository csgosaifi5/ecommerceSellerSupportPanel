import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function objectToFormData(obj: Record<string, any>, imageFieldNames: string[] = []): FormData {

  const formObj = new FormData();

  Object.entries(obj).forEach(([key, value]) => {

    if (imageFieldNames.includes(key)) {
      if(!value) return;
      if (String(value).startsWith("http")) {
        formObj.append(key, value);
      }
      else {
        const file = base64toFile(value, 'profile_image.png');
        formObj.append(key, file);
      }
    } else {
      formObj.append(key, value);
    }
  });

  return formObj;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

//base64toFile

export function isUrl(str: string): boolean {
  return z.string().url().safeParse(str).success;
}

export function base64toFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

//check if any property of object is not empty

export function isObjectEmpty(obj: Record<string, any>): boolean {
  return Object.values(obj).every(x => (x === null || x === '' ||Boolean(x) === false));
}

//capitalize first letter of string

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function addLineBreaks(str:string) {
  return str.replace(/,/g, ",\n");
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

const OfferStatus = {
  REVISED: 'revised',
  CLOSED: 'closed',
  REJECTED: 'rejected',
  APPROVED: 'approved',
  NOT_APPROVED: 'not-approved',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  DRAFT: 'draft',
  SENT: 'sent',
  CANCELLED: 'cancelled',
  DELIVERED_WITH_DEFECTS: 'delivered-with-defects'
};

// Function to check if the status is approved
export function isApproved(status: any) {
  switch (status) {
    case OfferStatus.APPROVED:
      return true;
    case OfferStatus.REJECTED:
      return false;
    case OfferStatus.NOT_APPROVED:
      return false;
    case OfferStatus.DRAFT:
      return false;
    case OfferStatus.REVISED:
      return false;
    case OfferStatus.SENT:
      return true;
    default:
      return true;
  }
}
