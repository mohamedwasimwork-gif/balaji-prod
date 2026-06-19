import { apiClient } from './api.client';
import { Lead } from '@dashboard/types';

export interface LeadFilters {
  page?: number;
  limit?: number;
  status?: 'new' | 'contacted' | 'closed';
  formName?: string;
  search?: string;
}

export interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
}

export interface LeadStatsResponse {
  total: number;
  byStatus: { new: number; contacted: number; closed: number };
  today: number;
  last7Days: number;
  last30Days: number;
}

export const leadsService = {
  getLeads: async (filters?: LeadFilters): Promise<LeadsResponse> => {
    const response = await apiClient.get('/leads', { params: filters });
    return response.data;
  },

  getLead: async (id: string): Promise<Lead> => {
    const response = await apiClient.get(`/leads/${id}`);
    return response.data;
  },

  updateLead: async (
    id: string,
    data: { status?: 'new' | 'contacted' | 'closed'; notes?: string }
  ): Promise<Lead> => {
    const response = await apiClient.patch(`/leads/${id}`, data);
    return response.data;
  },

  deleteLead: async (id: string): Promise<void> => {
    await apiClient.delete(`/leads/${id}`);
  },

  getStats: async (): Promise<LeadStatsResponse> => {
    const response = await apiClient.get('/leads/stats/summary');
    return response.data;
  },
};
