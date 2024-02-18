import Input from "../Input/Input";
import * as Styled from "./Styled";

const H1ForStudent = ({ value }) => {
  return (
    <Styled.Wrapper>
      <Input disabled defaultValue={value} />
    </Styled.Wrapper>
  );
};

export default H1ForStudent;
