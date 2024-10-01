import api from "./instance";

export const userAPI = {
  getUser: async () => {
    return api.get("/user/current-user");
  },
  getDashboardData: async (filter: any) => {
    return api.get("/user/dashboard", {
      params: filter,
    });
  },
  getActionItems: async () => {
    return api.get("/user/action-items");
  },
  getAdminAddress: async () => {
    return api.get("/user/admin-address");
  },
  login: async (payload: { email: string; password: string }) => {
    return api.post("/user/login", payload);
  },
  loginWithOtp: async (payload: { email: string }) => {
    return api.post("/user/login/otp", payload);
  },
  register: async (payload: { email: string }) => {
    return api.post("/user", payload);
  },
  updateUser: async (payload: any) => {
    return api.put("/user", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  },
  verifyOtp: async (payload: { email: string; otp: string }) => {
    return api.post("/user/login/verify-otp", payload);
  },
  getEstimate: async (payload: any) => {
    return api.post("user/estimation", payload);
  },
  getNotifications: async (filter: any) => {
    return api.post("/notification/list", filter);
  },
  updateNotification: async (payload: any) => {
    return api.put("/notification", payload);
  },
  getFaqs: async () => {
    return api.get("/faq/category");
  },
  logout: async () => {
    return api.post("/user/logout");
  },
};
