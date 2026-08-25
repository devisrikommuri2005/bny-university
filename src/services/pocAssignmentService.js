import api from "./api";

export const getAssignedEmployees =
  async (pocId) => {

    const response =
      await api.get(
        `/admin/poc-assignments/${pocId}/employees`
      );

    return response.data;
};

export const assignEmployeeToPoc = async (
    userId,
    pointOfContactId
) => {

    return await api.post(
        "/admin/poc-assignments",
        {
            userId,
            pointOfContactId
        }
    );
};