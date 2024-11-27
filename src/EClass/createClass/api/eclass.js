import { customAxios } from '../../../Common/CustomAxios';

export const createEclass = (eclassData) =>
  customAxios.post('api/steps/saveLectureContent', eclassData);
