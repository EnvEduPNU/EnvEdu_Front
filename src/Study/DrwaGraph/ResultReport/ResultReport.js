import CustomChart from "../CustomChart/CustomChart";
import CustomTable from "../CustomTable/CustomTable";
import * as Styled from "./Styled";
import makePdf from "../../../DataLiteracy/utils/makePdf";
import Textarea from "../../../DataLiteracy/common/Textarea/Textarea";

function ResultReport() {
  const onClick = async e => {
    e.preventDefault();
    await makePdf.viewWithPdf();
  };

  return (
    <Styled.Wrapper className="div_container">
      <Styled.Paper className="div_paper">
        <Styled.Box>
          <Styled.Title>우리학교 공기질 측정하기</Styled.Title>
        </Styled.Box>
        <Styled.Box>
          <Styled.SutTitle>목차</Styled.SutTitle>
          <ul style={{ fontSize: "20px" }}>
            <li>활동1: 교실의 공기질 측정하기</li>
            <li>
              활동2: 측정된 현재 데이터와 대기환경 기준 비교하고 이유 토론하기
            </li>
            <li>활동3: 그래프 만들어보기</li>
          </ul>
        </Styled.Box>
      </Styled.Paper>
      <Styled.Paper className="div_paper">
        <Styled.Box>
          <Styled.Title>활동1: 교실의 공기질 측정하기</Styled.Title>
          <CustomTable isChangeCategory={false} />
        </Styled.Box>
      </Styled.Paper>
      <Styled.Paper className="div_paper">
        <Styled.Box>
          <Styled.Title>
            활동2: 측정된 현재 데이터와 대기환경 기준 비교하고 이유 토론하기
          </Styled.Title>
          <Textarea value={"학생들이 입력한 내용이 들어갑니다."} />
        </Styled.Box>
      </Styled.Paper>
      <Styled.Paper className="div_paper">
        <Styled.Box>
          <Styled.Title>활동3: 그래프 만들어보기</Styled.Title>
          <CustomChart />
        </Styled.Box>
      </Styled.Paper>

      <button onClick={onClick}>pdf로 보기</button>
    </Styled.Wrapper>
  );
}

export default ResultReport;
