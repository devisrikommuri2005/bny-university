import api from "./api";

export const getPrograms = async () => {

    const response =
        await api.get(
            "/programs"
        );

    return response.data;
};

export const getProgramsByCategory =
  async (category) => {

    const response =
      await api.get(
        `/programs/category/${category}`
      );

    return response.data;
};