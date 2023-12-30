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
        <Styled.TableWrapper>
          <Styled.SutTitle>활동1. 교실의 공기질 측정하기</Styled.SutTitle>
          <CustomTable />
        </Styled.TableWrapper>
      </Styled.Paper>
      <Styled.Paper className="div_paper">
        <Styled.Box>
          <Styled.Title>활동2. 그래프를 만들어보세요.</Styled.Title>
          <CustomChart />
        </Styled.Box>
      </Styled.Paper>
      <Styled.Paper className="div_paper">
        <Styled.Box>
          <Styled.Title>활동3. 교실 대기질을 예측해보세요.</Styled.Title>
          <Textarea
            // placeholder={purpose}
            value={"학생들이 입력한 내용이 들어갑니다."}
          />
        </Styled.Box>
      </Styled.Paper>
      <button onClick={onClick}>pdf로 보기</button>
    </Styled.Wrapper>
  );
}

export default ResultReport;
