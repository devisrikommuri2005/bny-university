import api from "./api";

export const getInterviewCategories = async () => {
    const response = await api.get("/interview/categories");
    return response.data;
};

export const createInterviewCategory = async (data) => {

    const response = await api.post(
        "/admin/interview/categories",
        {
            name: data.name
        }
    );

    return response.data;
};