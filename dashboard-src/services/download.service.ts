import { apiClient } from './api.client';
import { DownloadReportData } from '@dashboard/types';

export interface DownloadReportScope {
  /** Every project belonging to a company. */
  companyName?: string;
  /** A single project. Takes precedence over companyName on the server. */
  projectId?: string;
}

export const downloadService = {
  getReport: async (scope: DownloadReportScope): Promise<DownloadReportData> => {
    const response = await apiClient.get('/admin/download/report', { params: scope });
    return response.data;
  },
};
