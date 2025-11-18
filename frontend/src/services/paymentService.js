import { apiCall } from '../config/api';

export const paymentService = {
  recordPayment: async ({ invoiceId, paymentMethod, amount, metadata = {} }) => {
    try {
      const body = { invoiceId, paymentMethod, amount, metadata };
      const data = await apiCall('/payments', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      return { success: true, data };
    } catch (error) {
      throw error;
    }
  },
};

export default paymentService;
