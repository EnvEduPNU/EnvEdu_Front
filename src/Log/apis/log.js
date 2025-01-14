import { customAxios } from '../../Common/CustomAxios';

export const saveLog = (paylaod) => customAxios.post('/api/logs/save', paylaod);

export const getAllLog = (paylaod) => customAxios.get('/api/logs/list-all');
