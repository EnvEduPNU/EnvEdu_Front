import CustomChart from "../../common/CustomChart/CustomChart";
import CustomTable from "../../common/CustomTable/CustomTable";
import Textarea from "../../common/Textarea/Textarea";
import { useGraphInterpreterStore } from "../../store/graphInterpreterStore";
import { useGraphDataStore } from "../../store/graphStore";
import makePdf from "../../utils/makePdf";
import * as Styled from "./Styled";

function ResultReport() {
  const { purpose, infomation } = useGraphInterpreterStore(
    state => state.userData
  );
  const tableTitle = useGraphDataStore(state => state.title);
  const onClick = async e => {
    e.preventDefault();
    await makePdf.viewWithPdf();
  };
  const researcher = {
    purpose: "연구진이 입력한 그래프 작성의 목적 Text Box",
    infomation: "연구진이 입력한 그래프에서 파악한 정보 Text Box",
  };

  return (
    <Styled.Wrapper className="div_container">
      <Styled.Paper className="div_paper">
        <Styled.Box>
          <Styled.Title>#Report - Class1 4학년 3반 이재훈</Styled.Title>
        </Styled.Box>
        <Styled.TableWrapper>
          <Styled.SutTitle>제목: {tableTitle}</Styled.SutTitle>
          <CustomTable />
        </Styled.TableWrapper>
      </Styled.Paper>
      <Styled.Paper className="div_paper">
        <Styled.Box>
          <Styled.Title>2. 나의 그래프</Styled.Title>
          <CustomChart />
        </Styled.Box>
        <Styled.Box>
          <Styled.SutTitle>그래프 목적</Styled.SutTitle>
          <Textarea disabled placeholder={purpose} value={purpose} />
        </Styled.Box>
        <Styled.Box>
          <Styled.SutTitle>그래프 목적</Styled.SutTitle>
          <Textarea disabled placeholder={infomation} value={infomation} />
        </Styled.Box>
      </Styled.Paper>
      <Styled.Paper className="div_paper">
        <Styled.Box>
          <Styled.Title>3. 연구진 그래프</Styled.Title>
          <CustomChart />
        </Styled.Box>
        <Styled.Box>
          <Styled.SutTitle>그래프 목적</Styled.SutTitle>
          <Textarea
            disabled
            placeholder={researcher.purpose}
            value={researcher.purpose}
          />
        </Styled.Box>
        <Styled.Box>
          <Styled.SutTitle>그래프 목적</Styled.SutTitle>
          <Textarea
            disabled
            placeholder={researcher.infomation}
            value={researcher.infomation}
          />
        </Styled.Box>
      </Styled.Paper>
      <button onClick={onClick}>pdf로 보기</button>
    </Styled.Wrapper>
  );
}

export default ResultReport;
