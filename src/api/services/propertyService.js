import axiosInstance from '../axiosConfig';

export const propertyService = {
  // Get all properties for public browsing (Tenant view)
  getAllProperties: async () => {
    const response = await axiosInstance.get('/api/Property');
    return response.data;
  },

  // Get a single property by ID
  getPropertyById: async (id) => {
    const response = await axiosInstance.get(`/api/Property/${id}`);
    return response.data;
  },

  // Get properties owned/assigned to current Agent/Admin
  getMyProperties: async () => {
    const response = await axiosInstance.get('/api/Property/my-properties');
    return response.data;
  },

  // Get specific owned property details
  getMyPropertyById: async (id) => {
    const response = await axiosInstance.get(`/api/Property/my-properties/${id}`);
    return response.data;
  },

  // Create a new property (Agent/Admin only)
  createProperty: async (propertyData) => {
    const response = await axiosInstance.post('/api/Property', propertyData);
    return response.data;
  },

  // Update an existing property (Agent/Admin only)
  updateProperty: async (id, propertyData) => {
    const response = await axiosInstance.put(`/api/Property/${id}`, propertyData);
    return response.data;
  },

  // Delete a property (Agent/Admin only)
  deleteProperty: async (id) => {
    const response = await axiosInstance.delete(`/api/Property/${id}`);
    return response.data;
  },

  // Upload property thumbnail
  uploadThumbnail: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axiosInstance.post('/api/upload/thumbnail', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Usually returns { url: '...' } or a string with the image path
  },
};

export default propertyService;
