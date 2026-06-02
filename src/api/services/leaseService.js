import axiosInstance from '../axiosInstance';
import { unwrapResponse } from '../../utils/apiHelpers';

export const leaseService = {
  createLease: async (leaseData) => {
    const response = await axiosInstance.post('/api/lease', leaseData);
    return response.data;
  },

  getAgentLeases: async () => {
    const response = await axiosInstance.get('/api/lease/agent');
    return unwrapResponse(response) ?? [];
  },

  getMyLeases: async () => {
    const response = await axiosInstance.get('/api/lease/my-leases');
    return unwrapResponse(response) ?? [];
  },

  getLeaseById: async (id) => {
    const response = await axiosInstance.get(`/api/lease/${id}`);
    return unwrapResponse(response);
  },

  getLeasesByProperty: async (propertyId) => {
    const response = await axiosInstance.get(`/api/lease/property/${propertyId}`);
    return unwrapResponse(response) ?? [];
  },

  activateLease: async (id) => {
    const response = await axiosInstance.put(`/api/lease/${id}/activate`);
    return response.data;
  },

  expireLease: async (id) => {
    const response = await axiosInstance.put(`/api/lease/${id}/expire`);
    return response.data;
  },

  terminateLease: async (id) => {
    const response = await axiosInstance.put(`/api/lease/${id}/terminate`);
    return response.data;
  },
};

export default leaseService;
