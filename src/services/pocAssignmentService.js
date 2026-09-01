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

export const removeEmployeeFromPoc =
  async (userId, pocId) => {

    const response =
      await api.delete(
        `/admin/poc-assignments/${pocId}/employees/${userId}`
      );

    return response.data;
};
