import CustomChart from "../../common/CustomChart/CustomChart";
import Textarea from "../../common/Textarea/Textarea";
import { useGraphInterpreterStore } from "../../store/graphInterpreterStore";
import * as Styled from "./Styled";

function GraphEvalutionRusult() {
  const { purpose, infomation } = useGraphInterpreterStore(
    state => state.userData
  );
  const researcher = {
    purpose: "연구진이 입력한 그래프 작성의 목적 Text Box",
    infomation: "연구진이 입력한 그래프에서 파악한 정보 Text Box",
  };
  return (
    <Styled.Wrapper>
      <Styled.ResultWrapper>
        <Styled.Box>
          <Styled.Title>연구진 그래프</Styled.Title>
          <CustomChart />
        </Styled.Box>
        <Styled.Box>
          <Styled.Title>그래프 목적</Styled.Title>
          <Textarea disabled placeholder={purpose} />
        </Styled.Box>
        <Styled.Box>
          <Styled.Title>그래프 목적</Styled.Title>
          <Textarea disabled placeholder={infomation} />
        </Styled.Box>
      </Styled.ResultWrapper>
      <Styled.ResultWrapper>
        <Styled.Box>
          <Styled.Title>나의 그래프</Styled.Title>
          <CustomChart />
        </Styled.Box>
        <Styled.Box>
          <Styled.Title>그래프 목적</Styled.Title>
          <Textarea disabled placeholder={purpose} />
        </Styled.Box>
        <Styled.Box>
          <Styled.Title>그래프 목적</Styled.Title>
          <Textarea disabled placeholder={infomation} />
        </Styled.Box>
      </Styled.ResultWrapper>
    </Styled.Wrapper>
  );
}

export default GraphEvalutionRusult;
