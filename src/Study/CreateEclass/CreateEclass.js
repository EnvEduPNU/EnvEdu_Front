import { useState } from "react";
import { useTabStore } from "../store/tabStore";
import { useGraphDataStore } from "../store/graphStore";
import * as Styled from "./Styled";
import CustomTable from "../DrwaGraph/CustomTable/CustomTable";
import { Button } from "react-bootstrap";
import CustomTableHeader from "../DrwaGraph/CustomTable/CustomTableHeader";
import GraphAndEditor from "../DrwaGraph/GraphAndEditor/GraphAndEditor";
import EClassPage from "../../EClass/Page/EClassPage/EClassPage";
import Header from "../DrwaGraph/Header/Header";
import AppendActivityDialog from "../../EClass/Component/AppendActivityDialog/AppendActivityDialog";
import Table from "../../EClass/Component/Table/Table";
import ClassroomType from "../../EClass/utils/classRoomType";
import Chart from "../../EClass/Component/Chart/Chart";
import { useBarStore } from "../store/barStore";
import useChartMetaDataStore from "../store/chartMetaDataStore";
import { useLineStore } from "../store/lineStore";
import { useBubbleStore } from "../store/bubbleStore";
import { useScatterStore } from "../store/scatterStore";
import { useMixStore } from "../store/mixStore";

function CreateEClass() {
  const tab = useTabStore(state => state.tab);
  const [showModal, setShowModal] = useState(false);
  const data = useGraphDataStore(state => state.data);
  const graphIdx = useGraphDataStore(state => state.graphIdx);

  const getGraphState = () => {
    if (graphIdx === 0) return useBarStore.getState();
    if (graphIdx === 1) return useLineStore.getState();
    if (graphIdx === 2) return useBubbleStore.getState();
    if (graphIdx === 4) return useScatterStore.getState();
    if (graphIdx === 5) return useMixStore.getState();
  };

  return (
    <Styled.Wrapper>
      <Header isEclassTab />
      {tab === "table" && (
        <>
          <CustomTable />
          <Button
            style={{
              position: "absolute",
              right: "30px",
              bottom: "100px",
              width: "fit-content",
            }}
            onClick={() => setShowModal(true)}
          >
            E-Class로 내보내기
          </Button>

          <AppendActivityDialog
            visible={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={() => setShowModal(false)}
            answer={<Table tableData={data} />}
            classroomType={ClassroomType.MATRIX}
            data={data}
          />
        </>
      )}
      {tab === "graph" && (
        <>
          <CustomTableHeader />
          <GraphAndEditor />
          <Button
            style={{
              position: "absolute",
              left: "30px",
              top: "200px",
              width: "fit-content",
            }}
            onClick={() => setShowModal(true)}
          >
            E-Class로 내보내기
          </Button>

          <AppendActivityDialog
            visible={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={() => setShowModal(false)}
            answer={
              <Chart
                graphIdx={graphIdx}
                graphDataState={useGraphDataStore.getState()}
                graphState={getGraphState()}
                metaDataState={useChartMetaDataStore.getState()}
              />
            }
            classroomType={ClassroomType.CHART}
          />
        </>
      )}
      {tab === "eclass" && (
        <>
          <EClassPage />
        </>
      )}
    </Styled.Wrapper>
  );
}

export default CreateEClass;
