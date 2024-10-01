import api from "./instance";

const offerAPI = {
    getOffers: async (filters: any) => {
        const status = filters.status === 'all' ? '' : filters.status;
        const payment = filters.payment === 'all' ? '' : filters.payment;

        let id = filters.search;
        let product_name = filters.search;
        if (isNaN(filters.search))
            id = '';

        const payload = {
            filter: {
                from_date: new Date(filters.startDate),
                to_date: new Date(filters.endDate),
                id: id,
                product_name: product_name,
                offer_status: status,
                payment_status: payment,
            },
            length: 10,
            start: 10 * (filters.page - 1) || 0,
        };
        const response = await api.post('/offer/list', payload);
        return response.data;
    },
    getOfferById: async (id: string) => (await api.get(`/offer/${id}`)),
    updateOffer: async (payload: any) => {
           return api.put(`/offer`, payload,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        );
    },
    create: async (payload: any) => {
        return api.post('/offer/', payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
    },
    getOffersForMessages: async (params: any) => {
        return api.get('/offer/messages-list', { params });
    },
    cloneOffer: async (id: number) => {
        return api.get(`/offer/clone/${id}`);
    },
    upsertTrackingDetails: async ({offer_id,items}:any) => {
        return api.put(`/offer/${offer_id}/tracking-detail`, items);
    },
    getTrackingDetails: async (id: string) => {
        return api.get(`/offer/${id}/tracking-detail`);
    },
    deleteOffer: async (id: number) => {
        return api.delete(`/offer/${id}`);
    },
    downloadPdf: async (id: number) => {
        return api(`/offer/downloadPdf/${id}/user`);
    },
    getPayments: async () => {
        return api.get(`/offer/payment/detail`);
    }
};

export default offerAPI;