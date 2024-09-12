import Input from "../Input/Input";
import { useEClassStore } from "../../store/eClassStore";
import * as Styled from "./Styled";

const H2 = ({ placeholder = null, pageIndex, dataIndex }) => {
  const changeClassroomData = useEClassStore(
    state => state.changeClassroomData
  );
  const eClassData = useEClassStore(state => state.eClassData);

  const onChange = newValue => {
    changeClassroomData(pageIndex, dataIndex, "title", newValue);
  };
  return (
    <Styled.Wrapper>
      <Input
        placeholder={placeholder || "글을 작성해 주세요"}
        onChange={onChange}
        defaultValue={eClassData[pageIndex][dataIndex].title}
      />
    </Styled.Wrapper>
  );
};

export default H2;
