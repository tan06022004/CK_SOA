import { apiCall } from '../config/api';

export const employeeService = {
  getEmployees: async () => {
    try {
      const data = await apiCall('/employees');
      return data;
    } catch (error) {
      throw error;
    }
  },

  getEmployeeById: async (id) => {
    try {
      const data = await apiCall(`/employees/${id}`);
      return data;
    } catch (error) {
      throw error;
    }
  },

  createEmployee: async (employeeData) => {
    try {
      const data = await apiCall('/employees', {
        method: 'POST',
        body: JSON.stringify(employeeData),
      });
      return { success: true, data };
    } catch (error) {
      throw error;
    }
  },

  updateEmployee: async (id, update) => {
    try {
      const data = await apiCall(`/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(update),
      });
      return { success: true, data };
    } catch (error) {
      throw error;
    }
  },

  deleteEmployee: async (id) => {
    try {
      const data = await apiCall(`/employees/${id}`, { method: 'DELETE' });
      return { success: true, data };
    } catch (error) {
      throw error;
    }
  },
};

export default employeeService;
