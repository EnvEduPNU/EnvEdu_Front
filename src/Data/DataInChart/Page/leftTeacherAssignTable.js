import { Typography } from '@mui/material';
import './leftSlidePage.scss';
import { useEffect, useState } from 'react';
import { customAxios } from '../../../Common/CustomAxios';
import CustomDataAdaptor from '../DataSet/CustomDataAdaptor';

import { useGraphDataStore } from '../store/graphStore';

export default function LeftTeacherAssignTable({ content, setDataCategory }) {
  const { setData, setTitle } = useGraphDataStore();

  //TODO 1 : content uuid 저장된 테이블 찾아서 가져온다음 아래 버튼에 넣어주고 클릭하면 setDataCategory 넣어서 되돌려주기
  //TODO 2 : 가져와서 Dataset 테이블에 맞는 형식으로 데이터 세팅해줘야함
  //TODO 3 : 그리고 Data store에 set 해주고 로컬 스토리지에다가도 넣어주기. 그러면 끝.
  //TODO 4 : 이거 다해서 잘 되는거 확인 후에 전체 배포를 위한 병합 수행하고 배포 한번 하기
  const ClickTable = async () => {
    const response = await customAxios.get(`/api/custom/${content}`);

    const dataAdaptor = CustomDataAdaptor();
    const result = dataAdaptor.getTransformedData(response.data);

    console.log('데이터 내용 : ' + JSON.stringify(result, null, 2));

    const key = 'test';

    setData(result, key);
    setTitle(key);
    localStorage.setItem('data', JSON.stringify(result));
    localStorage.setItem('title', JSON.stringify(key));
    console.log('TeacherDataSet localStorage에 저장 완료!');

    setDataCategory('ExpertData');
  };

  return (
    <div style={{ margin: '0 5rem 0 3rem' }}>
      <div>
        <Typography
          sx={{
            fontSize: '3vh',
            color: 'black',
          }}
        >
          스텝 테이블
        </Typography>
      </div>
      <div style={{ height: '10vh', width: '20vh' }}>
        <div style={{ marginTop: '1rem' }} className="flex">
          <img
            src="/assets/img/folder-icon.png"
            style={{ width: '1.5rem', margin: '0 0.5rem' }}
          />
          <label
            onClick={() => ClickTable()}
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            스텝 데이터
          </label>
        </div>
      </div>

      <div></div>
    </div>
  );
}
