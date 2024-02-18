import Textarea from "../../../DataLiteracy/common/Textarea/Textarea";
import useEClassAssignmentStore from "../../store/eClassAssignmentStore";
import H2ForStudent from "../H2/H2ForStudent";
import * as Styled from "./Styled";

function QuestionForAssignment({ data, pageIndex, activityIndex }) {
  const changeEclassDataFieldValue = useEClassAssignmentStore(
    state => state.changeEclassDataFieldValue
  );
  return (
    <Styled.Wrapper>
      <H2ForStudent value={data.title} />
      <Textarea
        placeholder="답변을 작성해주세요"
        value={data.content}
        onChange={e =>
          changeEclassDataFieldValue(
            pageIndex,
            activityIndex,
            "content",
            e.target.value
          )
        }
      />
    </Styled.Wrapper>
  );
}

export default QuestionForAssignment;
