import api from "./api";

export const getInterviewQuestions = async () => {
    const response = await api.get("/interview/questions");
    return response.data;
};

export const getInterviewQuestionsByCategory = async (categoryId) => {
    const response = await api.get(
        `/interview/questions/category/${categoryId}`
    );

    return response.data;
};

export const createInterviewQuestion = async (data) => {
    const response = await api.post(
        "/admin/interview/questions",
        {
            categoryId: data.categoryId,
            question: data.question
        }
    );

    return response.data;
};

export const updateInterviewQuestion = async (id, data) => {
    const response = await api.put(
        `/admin/interview/questions/${id}`,
        {
            categoryId: data.categoryId,
            question: data.question
        }
    );

    return response.data;
};

export const deleteInterviewQuestion = async (id) => {
    const response = await api.delete(
        `/admin/interview/questions/${id}`
    );

    return response.data;
};