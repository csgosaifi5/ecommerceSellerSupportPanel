import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { productAPI } from "../axios/product-API";

export const useGetProducts = () => {
  return useQuery({
    retry: 1,
    queryKey: ["products"],
    queryFn: productAPI.getProducts,
  });
};

export const useGetBrands = () => {
  return useQuery({
    retry: 1,
    queryKey: ["brands"],
    queryFn: productAPI.getBrands,
  });
};
