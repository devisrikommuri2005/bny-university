import api from "./api";

export const getAllPOCs = async () => {

    const response =
        await api.get(
            "/admin/point-of-contacts"
        );

    return response.data;
};

export const createPOC = async (data) => {
    return await api.post(
        "/admin/point-of-contacts",
        {
            name: data.name,
            designation: data.role,
            email: data.email,
            phoneNumber: data.phone,
            active: true
        }
    );
};

export const updatePOCById = async (id,data) => {

    return await api.put(
        `/admin/point-of-contacts/${id}`,
        {
            name: data.name,
            designation: data.role,
            email: data.email,
            phoneNumber: data.phone,
            active: true
        }
    );
};

export const deletePOCById = async (id) => {

    return await api.delete(
        `/admin/point-of-contacts/${id}`
    );
};