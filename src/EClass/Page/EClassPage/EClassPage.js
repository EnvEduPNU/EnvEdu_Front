import { useState } from "react";
import * as Styled from "./Styled";
import H1 from "../../Component/H1/H1";
import H2 from "../../Component/H2/H2";
import Seed from "../../Component/Seed/Seed";
import Argument from "../../Component/Argument/Argument";
import Toolbar from "../../Component/ToolBar/Toolbar";
import PaperWithToolBar from "../../Component/PaperWithToolBar/PaperWithToolBar";

const EClassPage = () => {
  const [paperCnt, setPaperCnt] = useState(1);

  return (
    <Styled.Wrapper>
      {Array(paperCnt)
        .fill(1)
        .map((_, idx) => (
          <Styled.PaperWrapper key={idx}>
            <PaperWithToolBar />
          </Styled.PaperWrapper>
        ))}

      <button
        className="pageCreateBtn"
        onClick={() => setPaperCnt(cnt => cnt + 1)}
      >
        페이지 추가
      </button>
    </Styled.Wrapper>
  );
};

export default EClassPage;
