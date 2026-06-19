import { apiClient } from './api.client';
import { Expense, ProfitData } from '@dashboard/types';

export interface ExpenseFilters {
  page?: number;
  limit?: number;
  projectId?: string;
  amountType?: 'credit' | 'debit';
  paymentMode?: 'cash' | 'upi' | 'bank' | 'other';
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface ExpensesResponse {
  expenses: Expense[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateExpensePayload {
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

export const expensesService = {
  getExpenses: async (filters?: ExpenseFilters): Promise<ExpensesResponse> => {
    const response = await apiClient.get('/admin/expenses', { params: filters });
    return response.data;
  },

  getExpense: async (id: string): Promise<Expense> => {
    const response = await apiClient.get(`/admin/expenses/${id}`);
    return response.data;
  },

  createExpense: async (data: CreateExpensePayload): Promise<Expense> => {
    const response = await apiClient.post('/admin/expenses', data);
    return response.data;
  },

  updateExpense: async (id: string, data: Partial<CreateExpensePayload>): Promise<Expense> => {
    const response = await apiClient.put(`/admin/expenses/${id}`, data);
    return response.data;
  },

  deleteExpense: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/expenses/${id}`);
  },

  getProjectProfit: async (projectId: string): Promise<ProfitData> => {
    const response = await apiClient.get(`/admin/expenses/project/${projectId}/profit`);
    return response.data;
  },
};
