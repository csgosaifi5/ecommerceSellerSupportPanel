import SearchResults from "@/components/sections/selling-page/results-section";
import SearchSection from "@/components/sections/selling-page/search-section";
import { Suspense } from "react";

const SellingPage = () => {
  return (
    <>
      <Suspense>
        <SearchSection />
        <SearchResults />
      </Suspense>
    </>
  );
};

export default SellingPage;
