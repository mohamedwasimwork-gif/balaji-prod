import { apiClient } from './api.client';
import { DownloadReportData } from '@dashboard/types';

export const downloadService = {
  getReport: async (companyName: string): Promise<DownloadReportData> => {
    const response = await apiClient.get('/admin/download/report', { params: { companyName } });
    return response.data;
  },
};
