import { apiClient } from './api.client';

export const contentService = {
  getHomePage: async () => {
    const response = await apiClient.get('/page-content/home');
    return response.data;
  },

  updateHomePage: async (data: unknown) => {
    const response = await apiClient.put('/page-content/admin/home', data);
    return response.data;
  },

  getSolutionsPage: async () => {
    const response = await apiClient.get('/page-content/solutions');
    return response.data;
  },

  updateSolutionsPage: async (data: unknown) => {
    const response = await apiClient.put('/page-content/admin/solutions', data);
    return response.data;
  },

  getContactPage: async () => {
    const response = await apiClient.get('/page-content/contact');
    return response.data;
  },

  updateContactPage: async (data: unknown) => {
    const response = await apiClient.put('/page-content/admin/contact', data);
    return response.data;
  },

  getProjectsPage: async () => {
    const response = await apiClient.get('/page-content/projects');
    return response.data;
  },

  updateProjectsPage: async (data: unknown) => {
    const response = await apiClient.put('/page-content/admin/projects', data);
    return response.data;
  },
};
