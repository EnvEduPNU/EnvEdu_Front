import { useState } from "react";
import ActivityDialog from "../../component/ActivityDialog/ActivityDialog";
import Sharing from "../../component/Sharing/Sharing";
import { useTabStore } from "../../store/tabStore";
import CustomTable from "../CustomTable/CustomTable";
import CustomTableHeader from "../CustomTable/CustomTableHeader";
import GraphAndEditor from "../GraphAndEditor/GraphAndEditor";
import Header from "../Header/Header";
import ResultReport from "../ResultReport/ResultReport";
import * as Styled from "./Styled";
import { Button } from "react-bootstrap";
import { useGraphDataStore } from "../../store/graphStore";
import Assignment from "../../../EClass/Component/Assignment/Assignment";

function DrawGraph() {
  const tab = useTabStore(state => state.tab);
  const [showModal, setShowModal] = useState(false);
  const data = useGraphDataStore(state => state.data);

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
            onClick={() => setShowModal(true)}
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
