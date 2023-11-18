import { useState } from "react";
import ButtonSelector from "../../../common/ButtonSelector/ButtonSelector";
import * as Styled from "./Styled";
import Textarea from "../../../common/Textarea/Textarea";
import GraphEvalution from "../../GraphEvalution/GraphEvalution";

function EditorWrapper({ children }) {
  const [selectValue, setSelectValue] = useState("Editor");

  return (
    <Styled.Wrapper>
      <Styled.Box>
        <ButtonSelector
          // value={"에디터 선택"}
          defaultValue={"Editor"}
          selectList={["Editor", "평가하기"]}
          onChange={setSelectValue}
        />
      </Styled.Box>
      <Styled.Box>
        {selectValue === "Editor" ? children : <GraphEvalution />}
      </Styled.Box>
    </Styled.Wrapper>
  );
}

export default EditorWrapper;
