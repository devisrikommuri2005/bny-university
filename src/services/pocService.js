import api from "./api";

export const getPOCs = async () => {
  const response =
      await api.get("/point-of-contacts");

  return response.data;
};