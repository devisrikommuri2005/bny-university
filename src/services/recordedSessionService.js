import api from "./api";

export const getRecordedSessions =
    async (trainingId) => {

        const response =
            await api.get(
                `/trainings/${trainingId}/recorded-sessions`
            );

        return response.data;
    };

export const createRecordedSession =
    async (data) => {

        const response =
            await api.post(
                "/admin/recorded-sessions",
                data
            );

        return response.data;
    };

export const deleteRecordedSession =
    async (id) => {

        const response =
            await api.delete(
                `/admin/recorded-sessions/${id}`
            );

        return response.data;
    };