import Textarea from "../../../DataLiteracy/common/Textarea/Textarea";
import H2ForStudent from "../H2/H2ForStudent";
import * as Styled from "./Styled";

function QuestionForSubmit({ data }) {
  return (
    <Styled.WrapperForSubmit>
      <H2ForStudent value={data.title} />
      <Textarea value={data.content} />
    </Styled.WrapperForSubmit>
  );
}

export default QuestionForSubmit;
