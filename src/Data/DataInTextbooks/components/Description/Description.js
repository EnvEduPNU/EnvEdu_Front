import * as Styled from "./Styled";

function Description({ title, description }) {
  return (
    <Styled.Wrapper>
      <Styled.Title>{title}</Styled.Title>
      <Styled.SubTitle>{description}</Styled.SubTitle>
    </Styled.Wrapper>
  );
}

export default Description;
