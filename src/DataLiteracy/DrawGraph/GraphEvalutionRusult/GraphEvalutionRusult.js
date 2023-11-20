import { useNavigate } from "react-router-dom";
import CustomChart from "../../common/CustomChart/CustomChart";
import Textarea from "../../common/Textarea/Textarea";
import { useGraphInterpreterStore } from "../../store/graphInterpreterStore";
import * as Styled from "./Styled";

function GraphEvalutionRusult() {
  const navigate = useNavigate();
  const { purpose, infomation } = useGraphInterpreterStore(
    state => state.userData
  );
  const researcher = {
    purpose: "연구진이 입력한 그래프 작성의 목적 Text Box",
    infomation: "연구진이 입력한 그래프에서 파악한 정보 Text Box",
  };

  const onClickResultButton = () => {
    navigate("/dataLiteracy/result");
  };
  return (
    <Styled.Wrapper>
      <Styled.Container>
        <Styled.ResultWrapper>
          <Styled.Box>
            <Styled.Title>연구진 그래프</Styled.Title>
            <CustomChart />
          </Styled.Box>
          <Styled.Box>
            <Styled.Title>그래프 목적</Styled.Title>
            <Textarea disabled placeholder={researcher.purpose} />
          </Styled.Box>
          <Styled.Box>
            <Styled.Title>그래프 목적</Styled.Title>
            <Textarea disabled placeholder={researcher.infomation} />
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
      </Styled.Container>
      <Styled.ButtonWrapper>
        <Styled.Button onClick={onClickResultButton}>
          결과 보고서 보기
        </Styled.Button>
      </Styled.ButtonWrapper>
    </Styled.Wrapper>
  );
}

export default GraphEvalutionRusult;
