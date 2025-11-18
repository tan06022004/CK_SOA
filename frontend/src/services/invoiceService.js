import { apiCall } from '../config/api';

export const invoiceService = {
  getAllInvoices: async (filters = {}) => {
    try {
      const qs = new URLSearchParams(filters).toString();
      const data = await apiCall(`/invoices${qs ? `?${qs}` : ''}`);
      return data;
    } catch (error) {
      throw error;
    }
  },

  getInvoiceById: async (id) => {
    try {
      const data = await apiCall(`/invoices/${id}`);
      return data;
    } catch (error) {
      throw error;
    }
  },

  getGuestInvoice: async (bookingId) => {
    try {
      const data = await apiCall(`/invoices/guest/${bookingId}`);
      return data;
    } catch (error) {
      throw error;
    }
  },

  getFinancialInvoice: async (bookingId) => {
    try {
      const data = await apiCall(`/invoices/financial/${bookingId}`);
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default invoiceService;
