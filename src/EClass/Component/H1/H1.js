import Input from "../Input/Input";
import * as Styled from "./Styled";

const H1 = () => {
  return (
    <Styled.Wrapper>
      <Input placeholder={"제목을 지정해 주세요"} />
    </Styled.Wrapper>
  );
};

export default H1;
