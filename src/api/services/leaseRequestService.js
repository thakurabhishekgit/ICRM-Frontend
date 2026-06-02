import axiosInstance from '../axiosConfig';

export const leaseRequestService = {
  // Submit a new lease request (Tenant)
  createLeaseRequest: async (propertyId, message) => {
    const response = await axiosInstance.post('/api/LeaseRequest', {
      propertyId,
      message,
    });
    return response.data;
  },

  // Get current tenant's requests
  getMyRequests: async () => {
    const response = await axiosInstance.get('/api/LeaseRequest/my-requests');
    return response.data;
  },

  // Get requests assigned to current agent
  getAgentRequests: async () => {
    const response = await axiosInstance.get('/api/LeaseRequest/agent');
    return response.data;
  },

  // Approve lease request (Agent/Admin)
  approveRequest: async (id) => {
    const response = await axiosInstance.put(`/api/LeaseRequest/${id}/approve`);
    return response.data;
  },

  // Reject lease request (Agent/Admin)
  rejectRequest: async (id) => {
    const response = await axiosInstance.put(`/api/LeaseRequest/${id}/reject`);
    return response.data;
  },

  // Get requests for a specific property
  getRequestsByProperty: async (propertyId) => {
    const response = await axiosInstance.get(`/api/LeaseRequest/property/${propertyId}`);
    return response.data;
  },
};

export default leaseRequestService;
