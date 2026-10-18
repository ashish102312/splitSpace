import apiClient from './client';

export const getPersonalExpenses = async (params = {}) => {
  const response = await apiClient.get('/personal-expenses/', { params });
  return response.data;
};

export const getPersonalExpenseById = async (id) => {
  const response = await apiClient.get(`/personal-expenses/${id}`);
  return response.data;
};

export const createPersonalExpense = async (data) => {
  const response = await apiClient.post('/personal-expenses/', data);
  return response.data;
};

export const updatePersonalExpense = async (id, data) => {
  const response = await apiClient.put(`/personal-expenses/${id}`, data);
  return response.data;
};

export const deletePersonalExpense = async (id) => {
  const response = await apiClient.delete(`/personal-expenses/${id}`);
  return response.data;
};

export const getPersonalAnalytics = async () => {
  const response = await apiClient.get('/personal-expenses/analytics/summary');
  return response.data;
};
