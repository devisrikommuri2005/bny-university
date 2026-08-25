import api from "./api";

export const getIntroductionTrainings =
  async () => {

    const response =
      await api.get(
        "/trainings/type/INTRODUCTION"
      );

    return response.data;
};

export const getDomainTrainings =
  async () => {

    const response =
      await api.get(
        "/trainings/type/DOMAIN"
      );

    return response.data;
};

export const getFunctionalTrainings =
  async () => {

    const response =
      await api.get(
        "/trainings/type/FUNCTIONAL"
      );

    return response.data;
};