import { Badge } from "react-bootstrap";
import * as Styled from "./Styled";
import { useNavigate } from "react-router-dom";

function TextbookDataCard({ textbookData }) {
  const navigate = useNavigate();

  const onClickCard = () => {
    const tableData = textbookData.data.map(d => [...d]);
    tableData.unshift(textbookData.properties);
    navigate(`/textbook/detail`, {
      state: {
        textbookData: { ...textbookData, tableData },
      },
    });
  };

  return (
    <Styled.Wrapper onClick={onClickCard}>
      <Styled.Head>
        <Styled.Title>{textbookData.title}</Styled.Title>
        <Styled.Description>{textbookData.content}</Styled.Description>
      </Styled.Head>
      <Styled.Tags>
        <Badge bg="info">{textbookData.gradeLabel}</Badge>
        <Badge bg="info">{textbookData.subjectLabel}</Badge>
        <Badge bg="info">{textbookData.dataTypeLabel}</Badge>
      </Styled.Tags>
    </Styled.Wrapper>
  );
}

export default TextbookDataCard;
