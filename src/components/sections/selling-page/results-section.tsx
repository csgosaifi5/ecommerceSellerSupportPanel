"use client";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { products } from "./data";
import { ScrollBar } from "@/components/ui/scroll-area";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useGetBrands, useGetProducts } from "@/lib/react-query/product-query";
import { useMemo } from "react";
import LoadingScreen from "@/components/shared/loading-screen";
import RequestProductDialog from "@/components/forms/request-product-form";

const SearchResults = () => {
  //searchParams
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const { data: brandsData, isSuccess: brandSuccess } = useGetBrands();
  const {
    data: productsData,
    isSuccess: productSuccess,
    isLoading,
  } = useGetProducts();

  const brands = useMemo(() => {
    if (brandSuccess) return brandsData?.data.result ?? [];
    return [];
  }, [brandsData]);

  const products = useMemo(() => {
    if (productSuccess) {
      const unfilterdProducts = productsData?.data;
      return unfilterdProducts.filter((product: any) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return [];
  }, [productsData, search]);

  if (isLoading) return <LoadingScreen className="h-[60vh]" />;

  if (products.length === 0) {
    return <NoResults />;
  }
  return (
    <section className="container-main">
      <div>
        <h2 className="text-2xl mb-4 font-medium">Brands we prefer a lot</h2>
        <div className="flex flex-wrap  gap-4">
          {brands.map((brand: any, index: number) => (
            <div
              key={index}
              className="flex h-24 flex-1 min-w-24 max-w-28 items-center border-2 bg-white  p-4 rounded-2xl    overflow-hidden gap-4"
            >
              <img
                src={brand.image_url}
                className="h-full w-full object-cover ro"
                alt={brand.name}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 mb-16">
        <h2 className="text-2xl mb-4 font-medium">Items</h2>
        <div className="grid xl:grid-cols-5 lg:grid-cols-4 gap-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {products.map((product: any, index: number) => (
            <div
              key={index}
              className="flex  bg-white border-2 border-[#EBEBEB]  rounded-2xl h-80 flex-col gap-4"
            >
              <div className="flex justify-center flex-1 p-4 items-center">
                <img
                  src={product.image_url}
                  className="w-48 rounded-lg h-48"
                  alt={product.name}
                />
              </div>
              <div className="p-4 border-t-2 min-h-20 border-[#EBEBEB]  ">
                <h3 className="text-[#333333]  line-clamp-2  font-medium">
                  {product.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const NoResults = () => {
  return (
    <section className="container-main flex flex-col items-center justify-center pt-0 pb-24">
      <img
        src="/images/illustrations/no-result.svg"
        alt="No results found"
        className="w-1/2 max-w-[300px]"
      />

      <h2 className="text-xl font-medium my-4">
        Not able to find the product?
      </h2>
      <RequestProductDialog>
        <Button size={"lg"}>
          <span className="w-6 h-6 flex justify-center items-center mr-3 bg-white rounded-full">
            <Plus size={20} className="text-primary" />
          </span>
          Add a product
        </Button>
      </RequestProductDialog>
    </section>
  );
};

export default SearchResults;
