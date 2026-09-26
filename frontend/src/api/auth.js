import client from './client';

export const authApi = {
  login: (email, password) => client.post('/auth/login/', { email, password }),
  register: (name, email, password, confirmPassword) => 
    client.post('/auth/register/', { name, email, password, confirmPassword }),
  getMe: () => client.get('/auth/me/'),
  updateProfile: (name) => client.put('/auth/profile/', { name }),
  changePassword: (currentPassword, newPassword) => 
    client.post('/auth/change-password/', { currentPassword, newPassword }),
  logout: () => client.post('/auth/logout/'),
};
