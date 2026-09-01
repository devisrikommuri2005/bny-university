import api from "./api";

export const getAllUsers = async () => {

  const response =
    await api.get(
      "/auth/admin/users"
    );

  return response.data;
};

export const createUser = async (
  data
) => {

  const response =
    await api.post(
      "/auth/register",
      {
        fullName: data.fullName,
        email: data.email,
        username: data.username,
        password: data.password
      }
    );

  return response.data;
};

export const updateUserById =
  async (id, data) => {

    const response =
      await api.put(
        `/auth/admin/users/${id}`,
        {
          fullName: data.fullName,
          email: data.email,
          username: data.username,
          role: data.role
        }
      );

    return response.data;
};

export const deleteUserById =
  async (id) => {

    const response =
      await api.delete(
        `/auth/admin/users/${id}`
      );

    return response.data;
};

export const getUserById =
    async (id) => {

        const response =
            await api.get(
                `/auth/admin/users/${id}`
            );

        return response.data;
};