import { useState } from "react";
import * as Styled from "./Styled";
import GraphEvalution from "../../../../DataLiteracy/DrawGraph/GraphEvalution/GraphEvalution";

function EditorWrapper({ children }) {
  const [selectValue, setSelectValue] = useState("Editor");

  const onClickButton = v => {
    setSelectValue(v);
  };

  return (
    <Styled.Wrapper>
      <Styled.Box>
        <Styled.ButtonWrapper>
          {["Editor", "평가하기"].map(v => (
            <Styled.Button
              key={v}
              onClick={() => onClickButton(v)}
              $isSelected={selectValue === v}
            >
              {v}
            </Styled.Button>
          ))}
        </Styled.ButtonWrapper>
      </Styled.Box>
      <Styled.Box>
        {selectValue === "Editor" ? children : <GraphEvalution />}
      </Styled.Box>
    </Styled.Wrapper>
  );
}

export default EditorWrapper;
