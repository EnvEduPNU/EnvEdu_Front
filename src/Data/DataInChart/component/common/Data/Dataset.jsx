import * as Styled from './Styled';

import { useGraphDataStore } from '../../../store/graphStore';
import { sampleDatas } from '../../../data/sampleDatas';
import { useLogStore } from '../../../../../Log/store/logStore';
import { useLocation } from 'react-router-dom';

function Dataset({ setModalOpen }) {
  const { setData, setTitle, changeGraphIndex } = useGraphDataStore();
  const { startLog } = useLogStore();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const eclassUuid = searchParams.get('eclassUuid');
  const eclassName = searchParams.get('eclassName');

  const onClickBtn = (key) => {
    setData(sampleDatas[key], key);
    setTitle(key);

    // localStorage.setItem('data', JSON.stringify(sampleDatas[key]));
    // localStorage.setItem('title', JSON.stringify(key));
    // console.log('ExpertDataSet localStorage에 저장 완료!');

    console.log('데이터 내용 : ' + JSON.stringify(sampleDatas, null, 2));
    console.log('키는? : ' + JSON.stringify(key, null, 2));
    // 전문가 데이터 로그 시작
    startLog(
      localStorage.getItem('username'),
      `expert:${key}`,
      eclassUuid,
      eclassName,
    );
    changeGraphIndex(-1);
    setModalOpen(false);
  };

  return (
    <Styled.Wrapper>
      <Styled.Box key="header">
        <Styled.Number>순서</Styled.Number>
        <Styled.Data style={{ background: '#f9fafb' }}>
          Dataset Name
        </Styled.Data>
      </Styled.Box>

      {Object.keys(sampleDatas).map((key, idx) => (
        <Styled.Box key={key}>
          <Styled.Number>{idx + 1}</Styled.Number>
          <Styled.Data onClick={() => onClickBtn(key)}>{key}</Styled.Data>
        </Styled.Box>
      ))}
    </Styled.Wrapper>
  );
}

export default Dataset;
