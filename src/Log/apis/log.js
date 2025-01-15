import { customAxios } from '../../Common/CustomAxios';

export const saveLog = (paylaod) => customAxios.post('/api/logs/save', paylaod);

export const getAllLog = () => customAxios.get('/api/logs/list-all');

export const deleteLog = (logUuid) =>
  customAxios.delete(`/api/logs/delete/${logUuid}`);
