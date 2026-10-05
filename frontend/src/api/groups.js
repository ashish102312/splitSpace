import apiClient from './client';

export const getGroups = async () => {
  const response = await apiClient.get('/groups/');
  return response.data;
};

export const getGroupDetails = async (groupId) => {
  const response = await apiClient.get(`/groups/${groupId}`);
  return response.data;
};

export const createGroup = async (name, description) => {
  const response = await apiClient.post('/groups/', { name, description });
  return response.data;
};

export const joinGroup = async (code) => {
  const response = await apiClient.post('/groups/join', { code });
  return response.data;
};
