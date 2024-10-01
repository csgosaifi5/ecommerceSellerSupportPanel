import api from "./instance";

const messageAPI = {
  sendMessage: async (payload: any) => {
    const response = await api.post("/offer/message/post", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    return response.data;
  },
  getMessages: async (payload: getMessageFilter) => {
    const response = await api.post("/offer/message/list", payload);
    return response.data;
  },
};

export default messageAPI;

export interface getMessageFilter {
  id: string;
  sortBy: any;
  markRead: boolean;
}
