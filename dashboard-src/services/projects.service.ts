import { apiClient } from './api.client';
import { Project } from '@dashboard/types';

export interface ProjectFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'draft' | 'inactive';
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
}

export const projectsService = {
  getProjects: async (filters?: ProjectFilters): Promise<ProjectsResponse> => {
    const response = await apiClient.get('/projects', { params: filters });
    return response.data;
  },

  getProject: async (slug: string): Promise<Project> => {
    const response = await apiClient.get(`/projects/${slug}`);
    return response.data;
  },

  getAdminProjects: async (filters?: ProjectFilters): Promise<ProjectsResponse> => {
    const response = await apiClient.get('/admin/projects', { params: filters });
    return response.data;
  },

  getAdminProject: async (id: string): Promise<Project> => {
    const response = await apiClient.get(`/admin/projects/${id}`);
    return response.data;
  },

  createProject: async (data: Partial<Project>): Promise<Project> => {
    const response = await apiClient.post('/admin/projects', data);
    return response.data;
  },

  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    const response = await apiClient.put(`/admin/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/projects/${id}`);
  },
};
