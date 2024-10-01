import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import paymentMethodsAPI from "../axios/payment-methods-API";
import { toast } from "sonner";
import { useAuthStore } from "@/context/auth-context";
import { PaymentMethod } from "@/models/payment-method";

export const useGetPaymentMethods = () => {
    const { userDetails } = useAuthStore();
    return useQuery({
        queryKey: ['user', 'payment-methods'],
        queryFn: () => paymentMethodsAPI.getPaymentMethods(String(userDetails?.id) || "1"),
        enabled: !!userDetails?.id,

    });
}

export const useAddPaymentMethod = () => {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: paymentMethodsAPI.addPaymentMethod,
        onSuccess: () => {
            toast.success("Payment method added successfully");
            queryclient.invalidateQueries({ queryKey: ['user', 'payment-methods'] });
        },
        onError: (error: any) => {
            toast.error(error.response.data.error ?? "Error adding payment method");
        },
    });
}

export const useUpdatePaymentMethod = () => {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }: PaymentMethod) => paymentMethodsAPI.updatePaymentMethod(String(id), data),
        onSuccess: () => {
            toast.success("Payment method updated successfully");
            queryclient.invalidateQueries({ queryKey: ['user', 'payment-methods'] });
        },
        onError: (error: any) => {
            toast.error(error.response.data.error ?? "Error updating payment method");
        },
    });
}

export const useDeletePaymentMethod = () => {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: paymentMethodsAPI.deletePaymentMethod,
        onSuccess: () => {
            toast.success("Payment method deleted successfully");
            queryclient.invalidateQueries({ queryKey: ['user', 'payment-methods'] });
        },
        onError: (error: any) => {
            toast.error(error.response.data.error ?? "Error deleting payment method");
        },
    });
}