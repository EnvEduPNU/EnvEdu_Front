import { useState } from "react";
import ActivityDialog from "../../component/ActivityDialog/ActivityDialog";
import Sharing from "../../component/Sharing/Sharing";
import { useTabStore } from "../../store/tabStore";
import CustomTable from "../CustomTable/CustomTable";
import CustomTableHeader from "../CustomTable/CustomTableHeader";
import GraphAndEditor from "../GraphAndEditor/GraphAndEditor";
import Header from "../Header/Header";
import * as Styled from "./Styled";
import { Button } from "react-bootstrap";
import { useGraphDataStore } from "../../store/graphStore";
import Assignment from "../../../EClass/Component/Assignment/Assignment";
import useChartMetaDataStore from "../../store/chartMetaDataStore";
import { useBarStore } from "../../store/barStore";
import { useLineStore } from "../../store/lineStore";
import { useBubbleStore } from "../../store/bubbleStore";
import { useScatterStore } from "../../store/scatterStore";
import { useMixStore } from "../../store/mixStore";
import useEClassAssignmentStore from "../../../EClass/store/eClassAssignmentStore";

function DrawGraph() {
  const { tab, changeTab } = useTabStore();
  const [showModal, setShowModal] = useState(false);
  const { data, graphIdx, pageIndex, activityIndex } = useGraphDataStore();
  const changeChartDataValue = useEClassAssignmentStore(
    state => state.changeChartDataValue
  );

  const getAxisData = () => {
    if (graphIdx === 0) {
      const { min, max, stepSize } = useBarStore.getState();
      return { min, max, stepSize };
    }

    if (graphIdx === 1) {
      const { min, max, stepSize } = useLineStore.getState();
      return { min, max, stepSize };
    }

    if (graphIdx === 2) {
      const { xAxis, yAxis } = useBubbleStore.getState();
      return { xAxis, yAxis };
    }

    if (graphIdx === 4) {
      const { xAxis, yAxis } = useScatterStore.getState();
      return { xAxis, yAxis };
    }

    if (graphIdx === 5) {
      const { y1Axis, y2Axis } = useMixStore.getState();
      return { y1Axis, y2Axis };
    }
  };

  const getGraphData = () => {
    const { data, variables, graphIdx } = useGraphDataStore.getState();
    const {
      metaData: { legendPostion, datalabelAnchor },
    } = useChartMetaDataStore.getState();
    return {
      graphIdx,
      data,
      variables: variables.filter(
        variable => variable.isSelected && variable.axis !== null
      ),
      axisData: getAxisData(),
      metaData: { legendPostion, datalabelAnchor },
    };
  };

  const onClickGraphToAssignment = () => {
    changeChartDataValue(pageIndex, activityIndex, getGraphData());
    changeTab("assignment");
  };

  return (
    <Styled.Wrapper>
      <Header />
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
            보고서로 내보내기
          </Button>

          <Sharing />

          <ActivityDialog
            visible={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={() => setShowModal(false)}
            answer={data}
          />
        </>
      )}
      {tab === "graph" && (
        <>
          <CustomTableHeader />
          <GraphAndEditor />
          <Button
            onClick={onClickGraphToAssignment}
            style={{
              position: "absolute",
              left: "30px",
              top: "200px",
              width: "fit-content",
            }}
          >
            보고서로 내보내기
          </Button>
          <ActivityDialog
            visible={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={() => setShowModal(false)}
            answer={""}
          />
        </>
      )}
      {tab === "assignment" && (
        <>
          <Assignment />
        </>
      )}
    </Styled.Wrapper>
  );
}

export default DrawGraph;
