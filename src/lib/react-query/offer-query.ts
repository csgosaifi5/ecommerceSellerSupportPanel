import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import offerAPI from "../axios/offer-API";
import { toast } from "sonner";


export const useGetAllOffers = ({ filters }: { filters: any }) => {
    return useQuery({
        queryKey: ['offers', filters],
        queryFn: () => offerAPI.getOffers(filters),
    });
};

export const useGetOfferById = (id: string) => {
    return useQuery({
        queryKey: ['offers', id],
        queryFn: () => offerAPI.getOfferById(id),
    });
};

export const useGetOffersForMessages = (params: any) => {
    return useQuery({
        queryKey: ['offers', 'messages', params],
        queryFn: () => offerAPI.getOffersForMessages(params),
    });
}

export const useDownloadPdf = () => {
    return useMutation({
        mutationKey: ['offers', 'downloadPdf'],
        mutationFn: offerAPI.downloadPdf,
    });
}

export const useUpdateOffer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: offerAPI.updateOffer,
        onSuccess: (data) => {
            toast.success(data.data.message ?? "Offer updated successfully");
            queryClient.invalidateQueries(
                { predicate: query => query.queryKey[0] === 'offers' }
            )
        },
        onError: (error) => {
            toast.error("Failed to update offer");
        }
    });
}

export const useAddOffer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: offerAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries(
                { predicate: query => query.queryKey[0] === 'offers' }
            )
        },
    });
}

export const useCloneOffer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: offerAPI.cloneOffer,
        onSuccess: (data) => {
            toast.success(data.data.message);
            queryClient.invalidateQueries(
                { predicate: query => query.queryKey[0] === 'offers' }
            )
        },
        onError: (error) => {
            toast.error("Failed to delete offer");
        }
    });
}

export const useDeleteOffer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: offerAPI.deleteOffer,
        onSuccess: (data) => {
            toast.success(data.data.message);
            queryClient.invalidateQueries(
                { predicate: query => query.queryKey[0] === 'offers' }
            )
        },
        onError: (error) => {
            toast.error("Failed to delete offer");
        }
    });
}

export const useGetPayments = () => {
    return useQuery({
        queryKey: ['offers', 'payments'],
        queryFn: () => offerAPI.getPayments(),
    });
}

export const useUpsertTrackingDetails = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: offerAPI.upsertTrackingDetails,
        onSuccess: (data) => {
            toast.success(data.data.message);
            queryClient.invalidateQueries(
                { predicate: query => query.queryKey[0] === 'offers' }
            )
        },
        onError: (error) => {
            toast.error("Failed to add tracking details");
        }
    });
}

export const useGetTrackingDetails = (id: string) => {
    return useQuery({
        queryKey: ['offers', 'tracking', id],
        queryFn: () => offerAPI.getTrackingDetails(id),
    });
}