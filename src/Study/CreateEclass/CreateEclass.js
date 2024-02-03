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
import CustomChart from "../DrwaGraph/CustomChart/CustomChart";
import Table from "../../EClass/Component/Table/Table";

function CreateEClass() {
  const tab = useTabStore(state => state.tab);
  const [showModal, setShowModal] = useState(false);
  const data = useGraphDataStore(state => state.data);
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
            answer={<CustomChart />}
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
