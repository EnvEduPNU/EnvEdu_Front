import { customAxios } from '../../Common/CustomAxios';

export const saveCustomTableApi = (payload) =>
  customAxios.post('/api/custom/save', payload);
