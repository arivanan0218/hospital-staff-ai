import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error information
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error - Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.response.config?.url,
        method: error.response.config?.method,
        data: error.response.data,
        headers: error.response.headers,
      });
      
      if (error.response.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error - No Response:', {
        message: error.message,
        request: error.request
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error - Request Setup:', error.message);
    }
    
    // Add more details to the error object
    error.details = {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    };
    
    return Promise.reject(error);
  }
);

// Staff API
export const staffAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('/staff', { params });
      return response;
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/staff/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching staff with ID ${id}:`, error);
      throw error;
    }
  },
  
  create: async (data) => {
    try {
      // Ensure we're sending proper JSON data
      const response = await apiClient.post('/staff', data, {
        headers: {
          'Content-Type': 'application/json',
        },
        transformRequest: [(data) => JSON.stringify(data)],
      });
      return response;
    } catch (error) {
      console.error('Error creating staff:', error.response?.data || error.message);
      throw error;
    }
  },
  
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/staff/${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        transformRequest: [(data) => JSON.stringify(data)],
      });
      return response;
    } catch (error) {
      console.error(`Error updating staff with ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/staff/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting staff with ID ${id}:`, error);
      throw error;
    }
  },
  
  getAvailability: async (id) => {
    try {
      const response = await apiClient.get(`/staff/${id}/availability`);
      return response;
    } catch (error) {
      console.error(`Error fetching availability for staff ${id}:`, error);
      throw error;
    }
  },
};

// Shifts API
export const shiftsAPI = {
  getAll: (params = {}) => apiClient.get('/shifts', { params }),
  getById: (id) => apiClient.get(`/shifts/${id}`),
  create: (data) => apiClient.post('/shifts', data),
  update: (id, data) => apiClient.put(`/shifts/${id}`, data),
  delete: (id) => apiClient.delete(`/shifts/${id}`),
  getAssignments: (id) => apiClient.get(`/shifts/${id}/assignments`),
  assignStaff: (shiftId, assignmentData) => apiClient.post(`/shifts/${shiftId}/assign`, assignmentData),
};

// Allocation API
export const allocationAPI = {
  createAllocation: (data) => apiClient.post('/allocation/create', data),
  getAllocations: (params = {}) => apiClient.get('/allocation', { params }),
  simulateScenarios: (data) => apiClient.post('/allocation/simulate', data),
  getAnalytics: () => apiClient.get('/allocation/analytics'),
};

// Dashboard API
export const dashboardAPI = {
  getMetrics: () => apiClient.get('/dashboard/metrics'),
  getRecentActivity: () => apiClient.get('/dashboard/activity'),
  getAlerts: () => apiClient.get('/dashboard/alerts'),
};

// Departments API
export const departmentsAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('/departments', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/departments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error);
      throw error;
    }
  },

  create: async (departmentData) => {
    try {
      const response = await apiClient.post('/departments', departmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  },

  update: async (id, departmentData) => {
    try {
      const response = await apiClient.put(`/departments/${id}`, departmentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating department ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/departments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting department ${id}:`, error);
      throw error;
    }
  },

  // Get staff members in a specific department
  getStaff: async (departmentId, params = {}) => {
    try {
      const response = await apiClient.get(`/departments/${departmentId}/staff`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching staff for department ${departmentId}:`, error);
      throw error;
    }
  }
};

export default apiClient;