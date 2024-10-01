import { useMutation, useQuery } from "@tanstack/react-query";
import guestAPI from "../axios/guest-API";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useGetTestimonials = () => {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: guestAPI.getTestimonials,
  });
};

export const usePostContactUs = () => {
  return useMutation({
    mutationKey: ["contactus"],
    mutationFn: guestAPI.postContactUs,
  });
};

export const useGetBanners = () => {
  return useQuery({
    queryKey: ["banners"],
    queryFn: guestAPI.getBanners,
  });
};

export const useGetShippingDetails = () => {
  return useQuery({
    queryKey: ["shipping-details"],
    queryFn: guestAPI.getShippingDetails,
  });
};

export const useAddNewsletterMail = () => {
  return useMutation({
    mutationKey: ["newsletter"],
    mutationFn: guestAPI.addNewsletterMail,
    onSuccess: (data) => {
      toast.success(data.data.message);
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message ?? "Error adding email to newsletter"
      );
    },
  });
};

export const useGetProductDetails = (upc: string) => {
  return useQuery({
    queryKey: ["product-details", upc],
    queryFn: () => guestAPI.getProductDetails(upc),
  });
};

export const useRequestProductDetails = () => {
  return useMutation({
    mutationKey: ["product-details"],
    mutationFn: guestAPI.addProductDetails,
  });
};

export const useGetConstants = () => {
  return useQuery({
    queryKey: ["constants"],
    queryFn: guestAPI.getConstants,
  });
};
