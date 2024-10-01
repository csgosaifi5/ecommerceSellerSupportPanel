import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import messageAPI, { getMessageFilter } from "../axios/message-API";

export const useGetAllMessages = (filters: getMessageFilter) => {
    return useQuery({
        queryKey: ['messages', filters],
        enabled: filters.id == "null" ? false : true,
        queryFn: () => messageAPI.getMessages(filters),

        staleTime: 20 * 100,
    });
};

export const useSendMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: messageAPI.sendMessage,
        onSuccess: () => {
            queryClient.invalidateQueries(
                { predicate: query => query.queryKey[0] === 'messages' }
            )
        },
    });
}