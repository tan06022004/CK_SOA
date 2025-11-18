import { apiCall } from '../config/api';

export const dashboardService = {
  getRevenue: async () => {
    try {
      const data = await apiCall('/dashboard/revenue');
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default dashboardService;
