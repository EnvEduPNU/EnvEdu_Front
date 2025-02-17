import { customAxios } from '../../../Common/CustomAxios';

export const getAllAccount = () => customAxios.get('/api/get/all-list');

export const putPassword = (username, oldPassword, newPassword) =>
  customAxios.put('/api/pwd-change', { username, oldPassword, newPassword });

export const addUser = (username, password, role) =>
  customAxios.post('/api/user/register', { username, password, role });

export const deleteUser = (username) =>
  customAxios.delete(`/api/user/delete/${username}`);
