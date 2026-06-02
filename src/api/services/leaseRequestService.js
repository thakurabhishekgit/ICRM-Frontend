import axiosInstance from '../axiosInstance';
import { unwrapResponse } from '../../utils/apiHelpers';

export const leaseRequestService = {
  createLeaseRequest: async (propertyId, message) => {
    const response = await axiosInstance.post('/api/LeaseRequest', { propertyId, message });
    return response.data;
  },

  getMyRequests: async () => {
    const response = await axiosInstance.get('/api/LeaseRequest/my-requests');
    return unwrapResponse(response) ?? [];
  },

  getAgentRequests: async () => {
    const response = await axiosInstance.get('/api/LeaseRequest/agent');
    return unwrapResponse(response) ?? [];
  },

  approveRequest: async (id) => {
    const response = await axiosInstance.put(`/api/LeaseRequest/${id}/approve`);
    return response.data;
  },

  rejectRequest: async (id) => {
    const response = await axiosInstance.put(`/api/LeaseRequest/${id}/reject`);
    return response.data;
  },

  getRequestsByProperty: async (propertyId) => {
    const response = await axiosInstance.get(`/api/LeaseRequest/property/${propertyId}`);
    return unwrapResponse(response) ?? [];
  },
};

export default leaseRequestService;
