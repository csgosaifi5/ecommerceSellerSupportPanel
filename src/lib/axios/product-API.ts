import api from "./instance";

export const productAPI = {
  getProducts: async () => {
    return api.get("/product");
  },

  getBrands: async () => {
    return api.get("/brand");
  },
};
