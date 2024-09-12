import { Typography } from "@mui/material";
import { useTabStore } from "../../store/tabStore";
import CustomTable from "../CustomTable/CustomTable";
import CustomTableHeader from "../CustomTable/CustomTableHeader";

import GraphAndEditor from "../GraphAndEditor/GraphAndEditor";
import ExpertGraphAndEditor from "../../../../DataLiteracy/DrawGraph/GraphAndEditor/ExpertGraphAndEditor";
import PublicDataButton from "./PublicDataButton";
import SEEdAppButton from "./SEEdAppButton";
import * as Styled from "./Styled";
import { useEffect, useState } from "react";

import GraphSelector from "../GraphSelector/GraphSelector";
import PdfButton from "./PdfButton";
import GraphSaveButton from "./GraphSaveButton";
import TableChangeButton from "./TableChangeButton";
import ExpertCustomTable from "../common/ExpertCustomTable";
import ExpertCustomTableHeader from "../CustomTable/ExpertCustomTableHeader";
import ExpertCustomGraph from "./ExpertCustomGraph";

// 테이블 아니면 그래프 선택하는 탭 컴포넌트
function TableOrGraph({ dataCategory }) {
  const { tab } = useTabStore();

  const [pdfClick, setPdfClick] = useState(false);
  const [tableSaveClick, setTableSaveClick] = useState(false);

  // graph 탭을 선택한 후 현재 페이지에서 이동할 경우 table로 초기화 시켜줘야한다.
  // 안그러면 현재 페이지 코드를 table에 종속시켜 놓은 코드가 존재하기에 오류가 난다.
  // useEffect(() => {
  //   if (location.pathname === "/data-in-chart") {
  //     changeTab("table");
  //   }
  // }, [location, changeTab]);

  useEffect(() => {
    return setPdfClick(false);
  }, [pdfClick]);

  useEffect(() => {
    return setTableSaveClick(false);
  }, [tableSaveClick]);

  return (
    <Styled.Wrapper>
      <Typography sx={{ fontSize: "3vh" }}>Data&Chart</Typography>

      {tab === "table" && (
        <Styled.CustomTableWrapper>
          {dataCategory === "MyData" && (
            <CustomTable tableSaveClick={tableSaveClick} />
          )}

          {dataCategory === "ExpertData" && <ExpertCustomTable />}

          <div style={{ display: "flex", flexDirection: "row" }}>
            <PublicDataButton buttonName={"공공데이터 가져오기"} />
            <SEEdAppButton buttonName={"SEEd 측정하기"} />
            <TableChangeButton
              buttonName={"테이블 저장하기"}
              setTableSaveClick={setTableSaveClick}
            />
          </div>
        </Styled.CustomTableWrapper>
      )}
      {tab === "graph" && (
        <>
          {dataCategory === "MyData" && (
            <>
              <CustomTableHeader />
              <GraphAndEditor pdfClick={pdfClick} />
              <div style={{ display: "flex", flexDirection: "row" }}>
                <GraphSaveButton buttonName={"그래프 저장"} />
                <GraphSelector />
                <PdfButton buttonName={"PDF 보기"} setPdfClick={setPdfClick} />
              </div>
            </>
          )}

          {dataCategory === "ExpertData" && (
            <>
              <ExpertCustomTableHeader />
              <ExpertCustomGraph />
            </>
          )}
        </>
      )}
    </Styled.Wrapper>
  );
}

export default TableOrGraph;
