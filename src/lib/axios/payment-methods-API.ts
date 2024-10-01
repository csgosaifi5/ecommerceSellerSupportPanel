import api from "./instance";

const paymentMethodsAPI = {
    getPaymentMethods: async (id: string) => {
        return api.get(`/user/paymentinfo/${id}`);
    },
    addPaymentMethod: async (payload: any) => {
        return api.post('/user/paymentinfo', payload);
    },
    deletePaymentMethod: async (id: string) => {
        return api.post(`/user/method/delete/${id}`);
    },
    updatePaymentMethod: async (id: string, payload: any) => {
        return api.put(`/user/paymentinfo/${id}`, payload);
    },
};

export default paymentMethodsAPI;