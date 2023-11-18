import Textarea from "../../common/Textarea/Textarea";
import { useGraphInterpreterStore } from "../../store/graphInterpreterStore";
import * as Styled from "./Styled";

function GraphEvalution() {
  const {
    userData: { purpose, infomation },
    changeUserData,
  } = useGraphInterpreterStore();
  return (
    <Styled.Wrapper>
      <Styled.Box>
        <Styled.Title>
          1. 그래프가 목적에 맞게 잘 그려졌는지 설명해봅시다.
        </Styled.Title>
        <Textarea
          value={purpose}
          onChange={e => changeUserData("purpose", e.target.value)}
        />
      </Styled.Box>
      <Styled.Box>
        <Styled.Title>
          2. 그래프를 보고 알 수 있는 정보를 써봅시다.
        </Styled.Title>
        <Textarea
          value={infomation}
          onChange={e => changeUserData("infomation", e.target.value)}
        />
      </Styled.Box>
    </Styled.Wrapper>
  );
}

export default GraphEvalution;
