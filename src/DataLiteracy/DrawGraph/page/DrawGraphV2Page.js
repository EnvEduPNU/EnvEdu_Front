import * as Styled from "./Styled";
import { useState } from "react";
import CustomTable from "../../common/CustomTable/CustomTable";
import Tab from "../../common/Tab/Tab";
import { ustTabStore } from "../../store/tabStore";
import Header from "../../common/Header/Header";
import BarEditor from "../Editor/BarEditor/BarEditor";
import CustomTableHeader from "../../common/CustomTable/CustomTableHeader";
import CustomBarChart from "../../common/CustomChart/CustomBarChart/CustomBarChart";
import Description from "../../common/Description/Description";

function DrawGraphV2Page() {
  const tab = ustTabStore(state => state.tab);
  return (
    <Styled.Wrapper>
      <Header />
      {tab === "table" && (
        <Styled.TableTabWrapper>
          <Description />
          <CustomTable />
        </Styled.TableTabWrapper>
      )}
      {tab === "graph" && (
        <Styled.GraphTapWrapper>
          <CustomTableHeader />
          <Styled.GraphWrapper>
            <CustomBarChart />
            <BarEditor />
          </Styled.GraphWrapper>
        </Styled.GraphTapWrapper>
      )}
    </Styled.Wrapper>
  );
}

export default DrawGraphV2Page;
