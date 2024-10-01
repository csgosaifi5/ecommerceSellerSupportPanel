"use client";
import { Input } from "@/components/ui/input";
import { QrCodeIcon, ScanBarcodeIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

const SearchSection = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const inpRef = useRef<HTMLInputElement>(null);
  let search = searchParams.get("search") ?? "";
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (inpRef.current && !inpRef.current.value) {
      inpRef.current.value = search;
    }
  }, [search]);

  let searchTimeout: NodeJS.Timeout;
  const handleSearch = (value: string) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      router.push(pathname + '?' + createQueryString('search', value));
    }, 500);
  };

  return (
    <section className="md:py-24 py-20  flex flex-col container-main justify-center ">
      <header className="mb-8">
        <h1 className="font-display md:text-5xl text-4xl font-semibold text-center text-[#1e1e1e]">
          Products you can sell
        </h1>
      </header>
      <main className="relative w-full flex justify-center">
        <div className=" relative w-full  max-w-2xl">
          <Input
            ref={inpRef}
            onChange={(e) => {handleSearch(e.target.value)}}
            placeholder="Enter the product/UPC you want to sell"
            className="md:h-[86px] h-16 md:text-lg text-sm font-medium mx-auto w-full md:px-8 px-4 rounded-full"
          />
          <ScanBarcodeIcon
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-primary"
            size={24}
          />
        </div>
      </main>
    </section>
  );
};

export default SearchSection;
