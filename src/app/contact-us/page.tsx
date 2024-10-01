import FaqSection from "@/components/sections/contact-page/faq-section";
import { Suspense } from "react";

import dynamic from "next/dynamic";

const ContactFormSection = dynamic(
  () => import("@/components/sections/contact-page/contact-form-section"),
  { ssr: false }
);

const ContactPage = () => {
  return (
    <>
      <Suspense>
        <FaqSection />
        <ContactFormSection />
      </Suspense>
    </>
  );
};

export default ContactPage;
