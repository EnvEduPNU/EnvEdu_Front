import * as Styled from "./Styled";
import result from "../utils/data.json";
import TextbookDataCard from "../components/TextbookDataCard/TextbookDataCard";
import TagsInput from "../components/TagsInput/TagsInput";

function TextbookPage() {
  const elementaryData = result.data.filter(
    data => data.tag["gradeLabel"] === "초등학교"
  );
  const middleData = result.data.filter(
    data => data.tag["gradeLabel"] === "중학교"
  );
  const highData = result.data.filter(
    data => data.tag["gradeLabel"] === "고등학교"
  );

  console.log(middleData[0].tableData[0]);
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
