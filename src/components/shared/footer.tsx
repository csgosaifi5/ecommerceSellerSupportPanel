import { Instagram, Mail, Map, Pin } from "lucide-react";
import Logo from "./logo";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import PinIcon from "../icons/pin-icon";
import MailIcon from "../icons/mail-icon";
import {
  FacebookIcon,
  InstaIcon,
  TwitterIcon,
  YoutubeIcon,
} from "../icons/social-media-icons";
import {
  useAddNewsletterMail,
  useGetConstants,
  useGetShippingDetails,
} from "@/lib/react-query/guest-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import TermsDialog from "./terms-dialog";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { data, isSuccess } = useGetShippingDetails();
  const { mutate, isPending } = useAddNewsletterMail();
  const { data: linkData } = useGetConstants();

  const socialMedia = useMemo(() => {
    if (linkData) {
      const data = linkData?.data.result;
      const socialMedia:any = {};
      data.forEach((item:any) => {
        const key:string = item.key;
        socialMedia[key] = item.value;
      });
      return socialMedia;
    }
    return {
      instagram: "",
      facebook: "",
      youtube: "",
      twitter: "",
      email: "",
    };
  }, [linkData]);

  
  const handleSubscribe = () => {
    //email regex
    const emailRegex = z.string().email();
    try {
      emailRegex.parse(email);
      mutate({ email });
    } catch (error) {
      return toast.error("Invalid email");
    }
  };
  const shippingdetails = useMemo(() => {
    if (isSuccess) {
      return data?.data.data[0];
    }
    return {
      email: "-",
      phone: "-",
      address: "-",
    };
  }, [isSuccess, data]);

  return (
    <footer className="py-12 poppins md:px-[72px] rounded-t-[30px] bg-[#1A191D]">
      <div className="container-main flex-wrap  md:flex-row flex-col flex gap-16 justify-between">
        <Logo dark />
        <div className="text-white max-w-sm ">
          <h3 className=" mb-[14px] font-semibold">Contact</h3>
          <span className="flex gap-2.5 mb-3">
            <PinIcon className="!w-6 !h-6 " />
            <div>
              <span>{`${shippingdetails.street_address} ${shippingdetails.city}`}</span>
              <br />
              <span>{`${shippingdetails.state}, ${shippingdetails.country}, ${shippingdetails.postal_code}`}</span>
            </div>
          </span>
          <span className="flex gap-2.5">
            <MailIcon className="!w-6 h-6 " />{" "}
            <a href={shippingdetails.email}>{shippingdetails.email}</a>
          </span>
          <div className="flex gap-2 mt-4">
            <a href={socialMedia.instagram}>
              <InstaIcon />
            </a>
            <a href={socialMedia.facebook}>
              <FacebookIcon />
            </a>
            <a href={`mailto:${socialMedia.email}`}>
              <MailIcon />
            </a>
            <a href={socialMedia.youtube}>
              <YoutubeIcon />
            </a>
            <a href={socialMedia.twitter}>
              <TwitterIcon />
            </a>
          </div>
          <div className="mt-6  flex flex-col items-start space-y-4">
            <TermsDialog>
              <li className="list-disc text-primary">Terms and Conditions</li>
            </TermsDialog>
            <TermsDialog>
              <li className="list-disc text-primary">
                Sellzey Privacy Policies
              </li>
            </TermsDialog>
          </div>
        </div>
        <div className="">
          <h3 className="text-white mb-[14px] font-semibold">
            Download us from
          </h3>
          <div className="flex flex-col gap-2">
            <img
              alt="Google Download"
              className="w-36"
              src="/images/google-download.svg"
            />
            <img
              alt="Apple Download"
              className="w-36"
              src="/images/apple-download.svg"
            />
          </div>
        </div>
        <div className="bg-[#242329] md:max-w-[500px] flex-2 md:min-w-96 rounded-[20px] py-[30px] px-[36px]">
          <header className="mb-4">
            <h3 className="text-white mb-2">Subscribe</h3>
            <p className="text-[#A4A4A4] ">
              Subscribe to our newsletter for updates
            </p>
          </header>
          <div className="relative">
            <Input
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white dark h-[54px]"
            />
            <Button
              onClick={handleSubscribe}
              className="absolute right-2 top-2"
              size={"sm"}
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>
      <div className=" flex justify-center mt-10 items-center">
        <p className="text-gray-400 text-sm">
          Copyright © 2022 Sellzey. Designed with  by Spruko All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
