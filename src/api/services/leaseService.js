import axiosInstance from '../axiosConfig';

export const leaseService = {
  // Create a lease (Agent/Admin)
  createLease: async (leaseData) => {
    const response = await axiosInstance.post('/api/lease', leaseData);
    return response.data;
  },

  // Get all leases in the system (Admin only)
  getAllLeases: async () => {
    const response = await axiosInstance.get('/api/lease');
    return response.data;
  },

  // Get leases assigned to current Agent
  getAgentLeases: async () => {
    const response = await axiosInstance.get('/api/lease/agent');
    return response.data;
  },

  // Get current Tenant's leases
  getMyLeases: async () => {
    const response = await axiosInstance.get('/api/lease/my-leases');
    return response.data;
  },

  // Get a specific lease details
  getLeaseById: async (id) => {
    const response = await axiosInstance.get(`/api/lease/${id}`);
    return response.data;
  },

  // Get leases for a specific property
  getLeasesByProperty: async (propertyId) => {
    const response = await axiosInstance.get(`/api/lease/property/${propertyId}`);
    return response.data;
  },

  // Activate a lease
  activateLease: async (id) => {
    const response = await axiosInstance.put(`/api/lease/${id}/activate`);
    return response.data;
  },

  // Expire a lease
  expireLease: async (id) => {
    const response = await axiosInstance.put(`/api/lease/${id}/expire`);
    return response.data;
  },

  // Terminate an active lease
  terminateLease: async (id) => {
    const response = await axiosInstance.put(`/api/lease/${id}/terminate`);
    return response.data;
  },
};

export default leaseService;
