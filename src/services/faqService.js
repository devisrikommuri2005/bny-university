import api from "./api";

export const getFaqs = async () => {
    const response = await api.get("/interview/faqs");
    return response.data;
};

export const createFaq = async (data) => {
    const response = await api.post(
        "/admin/interview/faqs",
        {
            question: data.question,
            answer: data.answer
        }
    );

    return response.data;
};

export const updateFaq = async (id, data) => {
    const response = await api.put(
        `/admin/interview/faqs/${id}`,
        {
            question: data.question,
            answer: data.answer
        }
    );

    return response.data;
};

export const deleteFaq = async (id) => {
    const response = await api.delete(
        `/admin/interview/faqs/${id}`
    );

    return response.data;
};