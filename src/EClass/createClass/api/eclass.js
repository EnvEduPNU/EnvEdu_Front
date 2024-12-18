import { customAxios } from '../../../Common/CustomAxios';
import { v4 as uuidv4 } from 'uuid';

export const createEclass = async (eclassData) => {
  const handleCreate = async (eclassData) => {
    try {
      // Lecture 생성에 필요한 데이터 생성
      const eClassUuids = uuidv4();
      const lectureData = {
        eClassUuid: eClassUuids,
        lectureDataUuid: eclassData.uuid,
        lectureDataName: eclassData.stepName,
        username: localStorage.getItem('username'),
        lectureName: eclassData.stepName,
        startDate: eclassData.timestamp,
        eClassAssginSubmitNum: 0,
      };

      console.log('Body 확인 : ' + JSON.stringify(lectureData, null, 2));

      // 첫 번째 요청
      await customAxios.post('api/steps/saveLectureContent', eclassData);

      // 두 번째 요청
      // const createResponse = await customAxios.post(
      //   '/api/eclass/create',
      //   lectureData,
      // );

      console.log('Lecture created successfully:', createResponse.data);
    } catch (error) {
      console.error('There was an error:', error);
    }
  };

  // 비동기 함수 호출
  await handleCreate(eclassData);
};

export const getEClassDatas = () =>
  customAxios.get('/api/steps/getLectureContent');

export const putEClassThumbnail = (uuid, timestamp, imageUrl) =>
  customAxios.patch('/api/steps/updateThumbImg', {
    uuid,
    timestamp,
    thumbImg: imageUrl,
  });
