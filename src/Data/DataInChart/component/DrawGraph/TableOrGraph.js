import { Typography } from "@mui/material";
import { useTabStore } from "../../store/tabStore";
import CustomTable from "../CustomTable/CustomTable";
import ExpertCustomTable from "../../../../DataLiteracy/common/CustomTable/ExpertCustomTable";
import CustomTableHeader from "../CustomTable/CustomTableHeader";
import ExpertCustomTableHeader from "../../../../DataLiteracy/common/CustomTable/ExpertCustomTableHeader";
import GraphAndEditor from "../GraphAndEditor/GraphAndEditor";
import ExpertGraphAndEditor from "../../../../DataLiteracy/DrawGraph/GraphAndEditor/ExpertGraphAndEditor";
import PublicDataButton from "./PublicDataButton";
import SEEdAppButton from "./SEEdAppButton";
import * as Styled from "./Styled";
import { useEffect, useState } from "react";

import GraphSelector from "../GraphSelector/GraphSelector";

// 테이블 아니면 그래프 선택하는 탭 컴포넌트
function TableOrGraph(props) {
  const { tab } = useTabStore();
  const [dataName, setDataName] = useState();
  const [changeTab, SetChangeTab] = useState(tab);

  useEffect(() => {
    console.log("TableOrGraph 데이터 이름 : " + dataName);
    console.log("Tab : " + tab);

    if (changeTab !== tab) {
      console.log("Tab 변경 : " + tab);
      SetChangeTab(tab);
    } else {
      setDataName(props.button);
    }
  }, [props, tab]);

  return (
    <Styled.Wrapper>
      <Typography sx={{ fontSize: "3vh" }}>Data&Chart</Typography>

      {tab === "table" && (
        <Styled.CustomTableWrapper>
          {dataName === "MyData" && <CustomTable />}

          {dataName === "ExpertData" && <ExpertCustomTable />}

          <div style={{ display: "flex", flexDirection: "row" }}>
            <PublicDataButton buttonName={"공공데이터 가져오기"} />
            <SEEdAppButton buttonName={"SEEd 측정하기"} />
          </div>
        </Styled.CustomTableWrapper>
      )}
      {tab === "graph" && (
        <>
          {dataName === "MyData" && (
            <>
              <CustomTableHeader />
              <GraphAndEditor />
              <GraphSelector />
            </>
          )}

          {dataName === "ExpertData" && (
            <>
              <ExpertCustomTableHeader />
              <ExpertGraphAndEditor />
            </>
          )}
        </>
      )}
    </Styled.Wrapper>
  );
}

export default TableOrGraph;
