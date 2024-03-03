import { useEClassStore } from "../../store/eClassStore";
import Input from "../Input/Input";
import * as Styled from "./Styled";

const H1 = ({ pageIndex, dataIndex }) => {
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
        placeholder={"제목을 지정해 주세요"}
        onChange={onChange}
        defaultValue={eClassData[pageIndex][dataIndex].title}
      />
    </Styled.Wrapper>
  );
};

export default H1;
