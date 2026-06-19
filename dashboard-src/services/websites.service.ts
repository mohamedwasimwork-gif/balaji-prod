import { apiClient } from './api.client';
import { Website } from '@dashboard/types';

export interface WebsiteFilters {
  page?: number;
  limit?: number;
  siteType?: 'framer' | 'react';
  search?: string;
}

export interface WebsitesResponse {
  websites: Website[];
  total: number;
}

export const websitesService = {
  getWebsites: async (filters?: WebsiteFilters): Promise<WebsitesResponse> => {
    const response = await apiClient.get('/superadmin/websites', { params: filters });
    return response.data;
  },

  getWebsite: async (id: string): Promise<Website> => {
    const response = await apiClient.get(`/superadmin/websites/${id}`);
    return response.data;
  },

  createWebsite: async (data: {
    clientName: string;
    domain: string;
    siteType: 'framer' | 'react';
    cloudflareProjectId?: string;
  }): Promise<Website> => {
    const response = await apiClient.post('/superadmin/websites', data);
    return response.data;
  },

  updateWebsite: async (id: string, data: Partial<Website>): Promise<Website> => {
    const response = await apiClient.put(`/superadmin/websites/${id}`, data);
    return response.data;
  },

  deleteWebsite: async (id: string): Promise<void> => {
    await apiClient.delete(`/superadmin/websites/${id}`);
  },
};
