import { useState } from "react";
import Toolbar from "../ToolBar/Toolbar";
import * as Styled from "./Styled";

const PaperWithToolBar = ({ pageNum, activities }) => {
  return (
    <Styled.Wrapper>
      <Toolbar pageNum={pageNum} />
      <Styled.Paper>
        {activities.map((a, idx) => (
          <div key={idx}>{a}</div>
        ))}
      </Styled.Paper>
    </Styled.Wrapper>
  );
};

export default PaperWithToolBar;
