import api from "./api";

export const getAllTrainings = async () => {

    const response =
        await api.get(
            "/trainings"
        );

    return response.data;
};

export const getTrainingById = async (
    id
) => {

    const response =
        await api.get(
            `/trainings/${id}`
        );

    return response.data;
};

export const createTraining = async (
    data
) => {

    const response =
        await api.post(
            "/admin/trainings",
            {
                title: data.title,
                description: data.description,
                sharePointUrl:
                    data.sharePointUrl,
                trainingType:
                    data.trainingType,
                active:
                    data.active ?? true
            }
        );

    return response.data;
};

export const updateTrainingById =
    async (
        id,
        data
    ) => {

        const response =
            await api.put(
                `/admin/trainings/${id}`,
                {
                    title: data.title,
                    description:
                        data.description,
                    sharePointUrl:
                        data.sharePointUrl,
                    trainingType:
                        data.trainingType,
                    active:
                        data.active
                }
            );

        return response.data;
    };

export const deleteTrainingById =
    async (id) => {

        const response =
            await api.delete(
                `/admin/trainings/${id}`
            );

        return response.data;
    };