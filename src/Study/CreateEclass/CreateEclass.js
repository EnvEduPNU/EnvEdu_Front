import { useState } from "react";
import { useTabStore } from "../store/tabStore";
import { useGraphDataStore } from "../store/graphStore";
import * as Styled from "./Styled";
import CustomTable from "../DrwaGraph/CustomTable/CustomTable";
import { Button } from "react-bootstrap";
import ActivityDialog from "../component/ActivityDialog/ActivityDialog";
import CustomTableHeader from "../DrwaGraph/CustomTable/CustomTableHeader";
import GraphAndEditor from "../DrwaGraph/GraphAndEditor/GraphAndEditor";
import EClassPage from "../../EClass/Page/EClassPage/EClassPage";
import Header from "../DrwaGraph/Header/Header";
import { useEClassStore } from "../../EClass/store/eClassStore";
import AppendActivityDialog from "../../EClass/Component/AppendActivityDialog/AppendActivityDialog";

function CreateEClass() {
  const tab = useTabStore(state => state.tab);
  const [showModal, setShowModal] = useState(false);
  const data = useGraphDataStore(state => state.data);
  const { eClass, appendActivity } = useEClassStore();
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
            E-Class로 내보내기
          </Button>

          <AppendActivityDialog
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
        </>
      )}
      {tab === "assignment" && (
        <>
          <EClassPage />
        </>
      )}
    </Styled.Wrapper>
  );
}

export default CreateEClass;
