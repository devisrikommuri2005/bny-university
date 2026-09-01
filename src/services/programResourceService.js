import api from "./api";

export const getProgramResources =
  async (programId) => {

    const response =
      await api.get(
        `/programs/${programId}/resources`
      );

    return response.data;
  };
  
  export const createProgramResource = async (data) => {
    const response = await api.post(
      "/admin/program-resources",
      data
    );
    return response.data;
  };

  export const updateProgramResource = async (
    id,
    data
  ) => {
    const response = await api.put(
      `/admin/program-resources/${id}`,
      data
    );
    return response.data;
  };

  export const deleteProgramResource = async (
    id
  ) => {
    const response = await api.delete(
      `/admin/program-resources/${id}`
    );
    return response.data;
  };