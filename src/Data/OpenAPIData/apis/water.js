import { customAxios } from '../../../Common/CustomAxios';
import axios from 'axios';

const key = process.env.REACT_APP_DATA_KEY;

export const getWaterByPlace = (
  places,
  startYear,
  startMonth,
  endYear,
  endMonth,
) => {
  const wmyrList = [];
  const wmodList = [];

  for (let i = startYear; i <= endYear; i++) {
    wmyrList.push(i);
  }

  if (startYear === endYear) {
    for (let i = Number(startMonth); i <= Number(endMonth); i++) {
      console.log('123');
      if (i < 10) wmodList.push(`0${i}`);
      else wmodList.push(i);
      console.log(wmodList);
    }
  } else if (endYear - startYear > 1) {
    for (let i = 1; i <= 12; i++) {
      if (i < 10) wmodList.push(`0${i}`);
      else wmodList.push(i);
    }
  } else {
    for (let i = Number(startMonth); i <= 12; i++) {
      if (i < 10) wmodList.push(`0${i}`);
      else wmodList.push(i);
    }

    for (let i = 1; i <= Number(endMonth); i++) {
      if (i < 10) wmodList.push(`0${i}`);
      else wmodList.push(i);
    }
  }
  return axios.get(
    `https://apis.data.go.kr/1480523/WaterQualityService/getWaterMeasuringList`,
    {
      params: {
        ServiceKey: key,
        pageNo: 1,
        numOfRows: 100,
        resultType: 'JSON',
        ptNoList: places.join(','),
        wmyrList: wmyrList.join(','),
        wmodList: wmodList.join(','),
      },
    },
  );
};

export const saveWaterByPlace = (dataList, memo, title) =>
  customAxios.post('/ocean-quality', {
    data: dataList,
    memo,
    title,
  });
