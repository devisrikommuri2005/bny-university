import api from "./api";

export const createMandatoryTraining =
  async (data) => {

    return await api.post(
      "/admin/mandatory-trainings",
      {
        title: data.title,
        sharePointUrl: data.link
      }
    );
};

export const updateMandatoryTrainingById =
  async (id, data) => {

    return await api.put(
      `/admin/mandatory-trainings/${id}`,
      {
        title: data.title,
        sharePointUrl: data.link
      }
    );
};

export const deleteMandatoryTrainingById =
  async (id) => {

    return await api.delete(
      `/admin/mandatory-trainings/${id}`
    );
};