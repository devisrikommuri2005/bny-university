import api from "./api";

export const updateTrainingStatus =
  async (trainingId, status) => {

    const response =
      await api.put(
        `/mandatory-trainings/${trainingId}/status`,
        {
          status
        }
      );

    return response.data;
};

export const getTrainingStatuses =
  async () => {

    const response =
      await api.get(
        "/mandatory-trainings/status"
      );

    return response.data;
};