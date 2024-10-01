"use client";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/FormInput";
import FormProvider from "@/components/ui/form/FormProvider";
import FormTextArea from "@/components/ui/form/FormTextArea";
import {
  useGetShippingDetails,
  usePostContactUs,
} from "@/lib/react-query/guest-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Map, MapPin, Phone, PhoneCall, Pin } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  subject: z.string().min(5),
  description: z.string().min(10),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const defaultValues: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  description: "",
};

const ContactFormSection = () => {
  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  });

  const { data, isSuccess } = useGetShippingDetails();

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

  const { mutate, isPending } = usePostContactUs();
  const onSubmit = (data: ContactFormValues) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Message sent successfully");
        form.reset({
          name: "",
          email: "",
          subject: "",
          description: "",
        });
      },
    });
  };

  const reset = () => {
    form.reset({
      name: "",
      email: "",
      subject: "",
      description: "",
    });
  };
  return (
    <section className="grid container-main py-14 gap-8  md:grid-cols-12 grid-cols-1">
      <header className="md:col-span-12">
        <h2 className=" text-xl  font-semibold ml-2">Support</h2>
      </header>
      <aside className="md:col-span-4 space-y-6  bg-white rounded-[30px] p-6 ">
        <h3 className=" text-sm font-semibold !mb-8 text-gray-700">
          Contact us at
        </h3>
        <div className="flex gap-4">
          <Phone size={20} className="mt-1" />
          <div>
            <p className="  font-medium text-[#333333]">
              {shippingdetails.phone}
            </p>
            <h3 className=" text-sm font-medium  text-[#8A8A8A]">
              Toll free number
            </h3>
          </div>
        </div>
        <div className="flex gap-4">
          <Mail size={20} className="mt-1" />
          <div>
            <p className="  font-medium text-[#333333]">
              {shippingdetails.email}
            </p>
            <h3 className=" text-sm font-medium  text-[#8A8A8A]">
              Typical wait time: 2-3 days
            </h3>
          </div>
        </div>
        <div className="flex gap-4">
          <MapPin size={20} className="mt-1" />
          <div>
            <p className="  font-medium text-[#333333]">{`${shippingdetails.street_address} ${shippingdetails.city}`}</p>
            <h3 className=" text-sm font-medium  text-[#8A8A8A]">{`${shippingdetails.state}, ${shippingdetails.country}, ${shippingdetails.postal_code}`}</h3>
          </div>
        </div>
      </aside>
      <main className="md:col-span-8 space-y-6  bg-white rounded-[30px] p-6">
        <h3 className=" text-2xl font-semibold  text-gray-700">Contact Us</h3>
        <FormProvider
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
          methods={form}
        >
          <FormInput
            control={form.control}
            name="name"
            label="Name*"
            placeholder="Enter your name"
          />
          <FormInput
            control={form.control}
            name="email"
            label="Email*"
            placeholder="Enter your email"
          />
          <FormInput
            control={form.control}
            name="subject"
            label="Subject*"
            className="col-span-2"
            placeholder="Enter subject"
          />
          <div className="col-span-2">
            <FormTextArea
              control={form.control}
              name="description"
              label="Message*"
              className="h-32"
              placeholder="Enter your message"
            />
          </div>
          <footer className="col-span-2 py-8 space-x-4 flex justify-end">
            <Button onClick={reset} variant={"outline"} type="reset">
              Reset
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? "Sending..." : "Send Message"}
            </Button>
          </footer>
        </FormProvider>
      </main>
    </section>
  );
};

export default ContactFormSection;
