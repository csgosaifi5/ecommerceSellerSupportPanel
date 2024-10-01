"use client";
import { Button } from "@/components/ui/button";
import { cn, slugify } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useGetFAQs } from "@/lib/react-query/user-query";

const FaqSection = () => {
  const params = useSearchParams();
  const { data, isLoading, isSuccess } = useGetFAQs();

  const options: any[] = useMemo(() => {
    if (isSuccess) {
      return data.data.result.map((item: any) => ({
        label: item.label,
        slug: slugify(item.label),
        questions: item.faqs.map((faq: any) => ({
          question: faq.question,
          answer: faq.answer,
        })),
      }));
    }
    return [];
  }, [data, isSuccess]);

  const slug = params.get("section") ?? options[0]?.slug;

  const selectedOption = options.find((option) => option.slug === slug);

  return (
    <section className="grid container-main py-14 gap-8  md:grid-cols-12">
      <header className="md:col-span-12">
        <h2 className=" text-xl  font-semibold ml-2">{`FAQ's`}</h2>
      </header>
      <aside className="md:col-span-3 flex-col flex space-y-2  bg-white rounded-[30px] p-6 ">
        {options.map((option, index) => (
          <Button
            key={index}
            variant={"ghost"}
            asChild
            className="text-left px-0 flex justify-start"
          >
            <Link href={`?section=${option.slug}`}>
              <span
                className={cn(
                  "h-full w-1 mr-2 rounded-sm",
                  slug == option.slug ? "bg-primary" : "bg-transparent"
                )}
              />
              {option.label}
            </Link>
          </Button>
        ))}
      </aside>
      <main className="md:col-span-9 space-y-6  bg-white rounded-[30px] p-6">
        <h3 className=" text-2xl font-semibold mb-4  text-gray-700 capitalize">
          {selectedOption?.label}
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          {selectedOption &&
            selectedOption?.questions.map((question: any, index: number) => (
              <div key={index} className="space-y-2 text-[#333333]">
                <h4 className="text-sm  font-semibold">{question.question}</h4>
                <p className="text-sm ">{question.answer}</p>
              </div>
            ))}
        </div>
      </main>
    </section>
  );
};

export default FaqSection;
