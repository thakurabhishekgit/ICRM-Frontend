import axiosInstance from '../axiosConfig';

export const authService = {
  // Public Login
  login: async (email, password) => {
    const response = await axiosInstance.post('/api/Auth/login', { email, password });
    return response.data;
  },

  // Public Onboarding Registration
  register: async (fullName, email, password, phoneNumber, role) => {
    const response = await axiosInstance.post('/api/Auth/register', {
      fullName,
      email,
      password,
      phoneNumber,
      role,
    });
    return response.data;
  },

  // Admin restricted onboarding: Create Admin Agent
  createAgentWithAdminRole: async (fullName, email, password, phoneNumber) => {
    const response = await axiosInstance.post('/api/Auth/create-agent-with-admin-role', {
      fullName,
      email,
      password,
      phoneNumber,
      role: 2, // Admin UserRole
    });
    return response.data;
  },
};

export default authService;
