import api from "./api";

export const getMandatoryTrainings =
  async () => {

    const response =
      await api.get(
        "/mandatory-trainings"
      );

    return response.data;
};