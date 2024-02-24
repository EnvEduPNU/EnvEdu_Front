import * as Styled from "./Styled";
import result from "../utils/data.json";
import TextbookDataCard from "../components/TextbookDataCard/TextbookDataCard";
import TagsInput from "../components/TagsInput/TagsInput";

function TextbookPage() {
  return (
    <Styled.Wrapper>
      <Styled.SearchWrapper>
        <TagsInput />
      </Styled.SearchWrapper>

      <Styled.DataWrapper>
        {result.data.map((textbookData, index) => (
          <TextbookDataCard key={index} textbookData={textbookData} />
        ))}
      </Styled.DataWrapper>
    </Styled.Wrapper>
  );
}

export default TextbookPage;
