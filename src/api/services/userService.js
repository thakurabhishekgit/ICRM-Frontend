import axiosInstance from '../axiosConfig';

export const userService = {
  // Get all users in the system (Admin only)
  getAllUsers: async () => {
    const response = await axiosInstance.get('/api/User');
    return response.data;
  },

  // Get user details by ID
  getUserById: async (id) => {
    const response = await axiosInstance.get(`/api/User/${id}`);
    return response.data;
  },

  // Update a user's details / role (Admin/Self)
  updateUser: async (id, userData) => {
    const response = await axiosInstance.put(`/api/User/${id}`, userData);
    return response.data;
  },
};

export default userService;
