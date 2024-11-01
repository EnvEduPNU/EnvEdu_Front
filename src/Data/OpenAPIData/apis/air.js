import axios from 'axios';

const key = process.env.REACT_APP_DATA_KEY;

export const getPlaceByAddress = (place) => {
  return axios.get(
    `https://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getMsrstnList`,
    {
      params: {
        serviceKey: key,
        pageNo: 1,
        numOfRows: 100,
        returnType: 'json',
        addr: place,
      },
    },
  );
};

export const getAirByPlace = (
  place,
  startYear,
  startMonth,
  startDay,
  endYear,
  endMonth,
  endDay,
) => {
  const tempStartMonth = startMonth < 10 ? `0${startMonth}` : startMonth;
  const tempStartDay = startMonth < 10 ? `0${startDay}` : startDay;
  const tempEndMonth = endMonth < 10 ? `0${endMonth}` : endMonth;
  const tempEndDay = endMonth < 10 ? `0${endDay}` : endDay;
  return axios.get(
    `https://apis.data.go.kr/B552584/ArpltnStatsSvc/getMsrstnAcctoRDyrg`,
    {
      params: {
        serviceKey: key,
        returnType: 'json',
        numOfRows: 100,
        pageNo: 1,
        inqBginDt: `${startYear}${tempStartMonth}${tempStartDay}`,
        inqEndDt: `${endYear}${tempEndMonth}${tempEndDay}`,
        msrstnName: place,
      },
    },
  );
};
