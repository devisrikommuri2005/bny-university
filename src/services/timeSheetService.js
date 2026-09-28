import api from "./api";

export const getTimeSheetsByDate = async (date) => {
  const response = await api.get(
    `/timesheets?date=${date}`
  );

  return response.data;
};

export const createTimeSheet = async (payload) => {
  const response = await api.post(
    "/timesheets",
    payload
  );

  return response.data;
};

export const updateTimeSheet = async (
  id,
  payload
) => {
  const response = await api.put(
    `/timesheets/${id}`,
    payload
  );

  return response.data;
};

export const deleteTimeSheet = async (
  id
) => {
  const response = await api.delete(
    `/timesheets/${id}`
  );

  return response.data;
};