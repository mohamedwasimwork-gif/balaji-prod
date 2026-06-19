import { apiClient } from './api.client';

export interface ShowcaseProjectFilters {
  search?: string;
  status?: string;
  category?: string;
  limit?: number;
  page?: number;
}

export const showcaseService = {
  getProjects: async (filters?: ShowcaseProjectFilters) => {
    const response = await apiClient.get('/showcase-projects', { params: filters });
    return response.data;
  },

  getProject: async (id: string) => {
    const response = await apiClient.get(`/showcase-projects/admin/${id}`);
    return response.data;
  },

  createProject: async (data: unknown) => {
    const response = await apiClient.post('/showcase-projects/admin', data);
    return response.data;
  },

  updateProject: async (id: string, data: unknown) => {
    const response = await apiClient.put(`/showcase-projects/admin/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: string) => {
    const response = await apiClient.delete(`/showcase-projects/admin/${id}`);
    return response.data;
  },
};
