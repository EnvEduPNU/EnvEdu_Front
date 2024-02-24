import { Badge } from "react-bootstrap";
import * as Styled from "./Styled";

function TextbookDataCard({ textbookData }) {
  return (
    <Styled.Wrapper>
      <Styled.Head>
        <Styled.Title>{textbookData.title}</Styled.Title>
        <Styled.Description>{textbookData.description}</Styled.Description>
      </Styled.Head>
      <Styled.Tags>
        {Object.keys(textbookData.tag).map(key => (
          <Badge bg="info">{textbookData.tag[key]}</Badge>
        ))}
      </Styled.Tags>
    </Styled.Wrapper>
  );
}

export default TextbookDataCard;
