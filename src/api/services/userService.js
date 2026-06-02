import axiosInstance from '../axiosInstance';
import { unwrapResponse } from '../../utils/apiHelpers';

export const userService = {
  getAllUsers: async () => {
    const response = await axiosInstance.get('/api/User');
    return unwrapResponse(response) ?? [];
  },

  getUserById: async (id) => {
    const response = await axiosInstance.get(`/api/User/${id}`);
    return unwrapResponse(response);
  },

  updateUser: async (id, userData) => {
    const response = await axiosInstance.put(`/api/User/${id}`, userData);
    return unwrapResponse(response);
  },
};

export default userService;
