import axiosInstance from '../axiosInstance';
import { unwrapResponse } from '../../utils/apiHelpers';

export const aiService = {
  analyzeRoi: async (propertyId) => {
    const response = await axiosInstance.post(`/api/ai/roi-analysis/${propertyId}`);
    return unwrapResponse(response);
  },

  recommendProperties: async (payload) => {
    const response = await axiosInstance.post('/api/ai/recommend-properties', payload);
    return unwrapResponse(response);
  },

  generateMonthlyReport: async (month, year) => {
    const response = await axiosInstance.post('/api/ai/monthly-report', { month, year });
    return unwrapResponse(response);
  },

  getInsights: async () => {
    const response = await axiosInstance.get('/api/ai');
    return unwrapResponse(response) ?? [];
  },

  getInsightById: async (id) => {
    const response = await axiosInstance.get(`/api/ai/${id}`);
    return unwrapResponse(response);
  },

  deleteInsight: async (id) => {
    const response = await axiosInstance.delete(`/api/ai/${id}`);
    return response.data;
  },
};

export default aiService;
