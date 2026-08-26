import api from "./api";

export const getAllPrograms = async () => {

    const response =
        await api.get(
            "/programs"
        );

    return response.data;
};

export const createProgram = async (
    data
) => {

    const response =
        await api.post(
            "/admin/programs",
            data
        );

    return response.data;
};

export const updateProgramById =
    async (id, data) => {

        const response =
            await api.put(
                `/admin/programs/${id}`,
                data
            );

        return response.data;
};

export const deleteProgramById =
    async (id) => {

        const response =
            await api.delete(
                `/admin/programs/${id}`
            );

        return response.data;
};