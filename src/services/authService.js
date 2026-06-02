import axiosInstance from '../api/axiosInstance';

export const authService = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/api/Auth/login', { email, password });
    return response.data;
  },

  register: async ({ fullName, email, password, phoneNumber }) => {
    const response = await axiosInstance.post('/api/Auth/register', {
      fullName,
      email,
      password,
      phoneNumber,
    });
    return response.data;
  },
};

export default authService;
