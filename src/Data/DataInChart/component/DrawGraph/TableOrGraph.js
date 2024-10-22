import { Typography } from '@mui/material';
import { useTabStore } from '../../store/tabStore';
import CustomTable from '../CustomTable/CustomTable';
import CustomTableHeader from '../CustomTable/CustomTableHeader/CustomTableHeader';

import GraphAndEditor from '../GraphAndEditor/GraphAndEditor';
import PublicDataButton from './PublicDataButton';
import SEEdAppButton from './SEEdAppButton';
import * as Styled from './Styled';
import { useEffect, useState } from 'react';

import ExpertCustomTable from '../common/ExpertCustomTable';

import ExpertCustomGraph from './ExpertCustomGraph';
import ExpertCustomGraphHeader from './ExpertCustomGraphHeader';
import Header from '../Header/Header';
import DataInChartMainPage from './DataInChartMainPage';

// 테이블 아니면 그래프 선택하는 탭 컴포넌트
function TableOrGraph({ setSummary, setPhoto, dataCategory }) {
  const { tab } = useTabStore();

  const [pdfClick, setPdfClick] = useState(false);
  const [tableSaveClick, setTableSaveClick] = useState(false);

  const handleAddPhoto = (newPhoto) => {
    setPhoto(newPhoto);
  };

  useEffect(() => {
    return setPdfClick(false);
  }, [pdfClick]);

  useEffect(() => {
    return setTableSaveClick(false);
  }, [tableSaveClick]);

  return (
    <Styled.Wrapper>
      <div style={{ fontSize: '3vh', fontWeight: 'bold', marginLeft: '48px' }}>
        Data & Chart
      </div>

      {/* tab의 default 는 'table' */}
      {tab === 'table' && (
        <Styled.CustomTableWrapper>
          <div style={{ display: 'flex', width: '100%' }}>
            <div style={{ marginTop: '8rem', marginRight: '3rem' }}>
              <Header />
            </div>
            <div
              style={{
                flexGrow: 1,
                borderTop: '1px solid rgba(34, 36, 38, 0.15)',
              }}
            >
              <ExpertCustomTable
                setSummary={setSummary}
                onAddPhoto={handleAddPhoto}
              />
            </div>
          </div>
        </Styled.CustomTableWrapper>
      )}
      {tab === 'graph' && (
        <>
          {/* {dataCategory === 'MyData' && (
            <>
              <CustomTableHeader />
              <GraphAndEditor pdfClick={pdfClick} />
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <GraphSaveButton buttonName={'그래프 저장'} />
                <GraphSelector />
                <PdfButton buttonName={'PDF 보기'} setPdfClick={setPdfClick} />
              </div>
            </>
          )} */}

          {dataCategory === 'ExpertData' && (
            <div className="flex">
              <div className="mt-32 mr-12">
                <Header />
              </div>
              <div>
                <ExpertCustomGraphHeader />
                <ExpertCustomGraph onAddPhoto={handleAddPhoto} />
              </div>
            </div>
          )}
        </>
      )}
    </Styled.Wrapper>
  );
}

export default TableOrGraph;
