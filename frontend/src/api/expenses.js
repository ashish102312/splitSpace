import apiClient from './client';

export const getGroupExpenses = async (groupId) => {
  const response = await apiClient.get(`/expenses/group/${groupId}`);
  return response.data;
};

export const addExpense = async (groupId, description, totalAmount, paidBy, splits) => {
  const response = await apiClient.post('/expenses/', {
    group_id: groupId,
    description,
    total_amount: totalAmount,
    paid_by: paidBy,
    splits
  });
  return response.data;
};
