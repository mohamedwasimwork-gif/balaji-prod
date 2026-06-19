import { apiClient } from './api.client';
import { DashboardMetrics, EmployeeDashboardMetrics } from '@dashboard/types';

export const dashboardService = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    const response = await apiClient.get('/admin/dashboard-metrics');
    return response.data;
  },

  getActivity: async (params?: {
    page?: number;
    limit?: number;
    adminId?: string;
    actionType?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await apiClient.get('/admin/activity', { params });
    return response.data;
  },

  getActivityStats: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get('/admin/activity/stats', { params });
    return response.data;
  },

  getEmployeeMetrics: async (): Promise<EmployeeDashboardMetrics> => {
    const response = await apiClient.get('/admin/employee-metrics');
    return response.data;
  },
};
