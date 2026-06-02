import axiosInstance from '../axiosInstance';
import { unwrapResponse } from '../../utils/apiHelpers';

export const propertyService = {
  getAllProperties: async () => {
    const response = await axiosInstance.get('/api/Property');
    return unwrapResponse(response) ?? [];
  },

  getPropertyById: async (id) => {
    const response = await axiosInstance.get(`/api/Property/${id}`);
    return unwrapResponse(response);
  },

  getMyProperties: async () => {
    const response = await axiosInstance.get('/api/Property/my-properties');
    return unwrapResponse(response) ?? [];
  },

  getMyPropertyById: async (id) => {
    const response = await axiosInstance.get(`/api/Property/my-properties/${id}`);
    return unwrapResponse(response);
  },

  createProperty: async (propertyData) => {
    const response = await axiosInstance.post('/api/Property', propertyData);
    return unwrapResponse(response);
  },

  updateProperty: async (id, propertyData) => {
    const response = await axiosInstance.put(`/api/Property/${id}`, propertyData);
    return unwrapResponse(response);
  },

  deleteProperty: async (id) => {
    const response = await axiosInstance.delete(`/api/Property/${id}`);
    return response.data;
  },
};

export default propertyService;
