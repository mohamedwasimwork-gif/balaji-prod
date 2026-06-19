import { apiClient } from './api.client';
import { Invoice, ProfitData } from '@dashboard/types';

export interface InvoiceFilters {
  page?: number;
  limit?: number;
  projectId?: string;
  amountType?: 'credit' | 'debit';
  paymentMode?: 'cash' | 'upi' | 'bank' | 'other';
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface InvoicesResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateInvoicePayload {
  projectId: string;
  purpose: string;
  amount: number;
  amountType: 'credit' | 'debit';
  paymentMode: 'cash' | 'upi' | 'bank' | 'other';
  refId: string;
  remarks?: string;
  vendorName?: string;
  invoiceNumber?: string;
  gstNumber?: string;
}

export const invoicesService = {
  getInvoices: async (filters?: InvoiceFilters): Promise<InvoicesResponse> => {
    const response = await apiClient.get('/admin/invoices', { params: filters });
    return response.data;
  },

  getInvoice: async (id: string): Promise<Invoice> => {
    const response = await apiClient.get(`/admin/invoices/${id}`);
    return response.data;
  },

  getProfit: async (id: string): Promise<ProfitData> => {
    const response = await apiClient.get(`/admin/invoices/${id}/profit`);
    return response.data;
  },

  createInvoice: async (data: CreateInvoicePayload): Promise<Invoice> => {
    const response = await apiClient.post('/admin/invoices', data);
    return response.data;
  },

  updateInvoice: async (id: string, data: Partial<CreateInvoicePayload>): Promise<Invoice> => {
    const response = await apiClient.put(`/admin/invoices/${id}`, data);
    return response.data;
  },

  deleteInvoice: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/invoices/${id}`);
  },

  getProjectProfit: async (projectId: string): Promise<ProfitData> => {
    const response = await apiClient.get(`/admin/invoices/project/${projectId}/profit`);
    return response.data;
  },
};
