import Input from "../Input/Input";
import * as Styled from "./Styled";

const H2 = ({ placeholder = null }) => {
  return (
    <Styled.Wrapper>
      <Input placeholder={placeholder || "글을 작성해 주세요"} />
    </Styled.Wrapper>
  );
};

export default H2;
