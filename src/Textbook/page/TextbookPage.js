import * as Styled from "./Styled";
import result from "../utils/data2.json";
import TextbookDataCard from "../components/TextbookDataCard/TextbookDataCard";
import TagsInput from "../components/TagsInput/TagsInput";

function TextbookPage() {
  const elementaryData = result.filter(data =>
    data.gradeLabel.startsWith("초등")
  );
  const middleData = result.filter(data => data.gradeLabel.startsWith("중등"));
  const highData = result.filter(data => data.gradeLabel.startsWith("고등"));

  return (
    <Styled.Wrapper>
      <Styled.SearchWrapper>
        <TagsInput />
      </Styled.SearchWrapper>

      <Styled.H2>초등학교</Styled.H2>
      <Styled.DataWrapper>
        {elementaryData.map((textbookData, index) => (
          <TextbookDataCard key={index} textbookData={textbookData} />
        ))}
      </Styled.DataWrapper>
      <hr />

      <Styled.H2>중학교</Styled.H2>
      <Styled.DataWrapper>
        {middleData.map((textbookData, index) => (
          <TextbookDataCard key={index} textbookData={textbookData} />
        ))}
      </Styled.DataWrapper>
      <hr />

      <Styled.H2>고등학교</Styled.H2>
      <Styled.DataWrapper>
        {highData.map((textbookData, index) => (
          <TextbookDataCard key={index} textbookData={textbookData} />
        ))}
      </Styled.DataWrapper>
    </Styled.Wrapper>
  );
}

export default TextbookPage;
