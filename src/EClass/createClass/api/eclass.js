import { customAxios } from '../../../Common/CustomAxios';

export const createEclass = (eclassData) =>
  customAxios.post('api/steps/saveLectureContent', eclassData);

export const getEClassDatas = () =>
  customAxios.get('/api/steps/getLectureContent');

export const putEClassThumbnail = (uuid, timestamp, imageUrl) =>
  customAxios.patch('/api/steps/updateThumbImg', {
    uuid,
    timestamp,
    thumbImg: imageUrl,
  });
