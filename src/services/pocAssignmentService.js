import api from "./api";

export const getAssignedEmployees =
  async (pocId) => {

    const response =
      await api.get(
        `/admin/poc-assignments/${pocId}/employees`
      );

    return response.data;
};