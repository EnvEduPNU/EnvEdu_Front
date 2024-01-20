import { useState } from "react";
import Textarea from "../../../DataLiteracy/common/Textarea/Textarea";
import H2 from "../H2/H2";
import * as Styled from "./Styled";

const Question = () => {
  const [value, setValue] = useState("");
  return (
    <Styled.Wrapper>
      <H2 placeholder={"질문을 작성해주세요"} />
      <Textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="답변을 작성해주세요"
      />
    </Styled.Wrapper>
  );
};

export default Question;
