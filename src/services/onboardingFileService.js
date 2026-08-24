import api from "./api";

export const getOnboardingFiles = async () => {

  const response =
    await api.get("/onboarding-files");

  return response.data;
};