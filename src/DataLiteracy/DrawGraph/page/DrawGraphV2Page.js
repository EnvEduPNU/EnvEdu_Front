import * as Styled from "./Styled";
import { useState } from "react";
import CustomTable from "../../common/CustomTable/CustomTable";
import Tab from "../../common/Tab/Tab";
// import Tab from "../../common/Tab/Tab";

function DrawGraphV2Page() {
  const [tab, setTab] = useState("table");

  return (
    <Styled.Wrapper>
      <Tab tab={tab} setTab={setTab} />
      {tab === "table" && <CustomTable />}
    </Styled.Wrapper>
  );
}

export default DrawGraphV2Page;
