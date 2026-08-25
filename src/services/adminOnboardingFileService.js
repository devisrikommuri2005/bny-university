import api from "./api";

export const createOnboardingFile = async (
  data
) => {

  return await api.post(
    "/admin/onboarding-files",
    {
      title: data.title,
      sharePointUrl: data.link
    }
  );
};

export const updateOnboardingFileById =
  async (id, data) => {

    return await api.put(
      `/admin/onboarding-files/${id}`,
      {
        title: data.title,
        sharePointUrl: data.link
      }
    );
};

export const deleteOnboardingFileById =
  async (id) => {

    return await api.delete(
      `/admin/onboarding-files/${id}`
    );
};