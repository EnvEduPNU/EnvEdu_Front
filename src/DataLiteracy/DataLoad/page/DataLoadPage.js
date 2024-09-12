import LeftSlidePage from "../../../Data/DataInChart/Page/LeftSlidePage";
import TableOrGraph from "../../../Data/DataInChart/component/DrawGraph/TableOrGraph";
import SampleData from "../../DataInput/SampleData";
import Dataset from "../Dataset/Dataset";
import styled from "@emotion/styled";

const StyledDiv = styled.div`
  display: flex;
  padding: 0;
`;

function DataLoadPage() {
  return (
    <StyledDiv>
      <LeftSlidePage />

      <TableOrGraph />
    </StyledDiv>
  );
}

export default DataLoadPage;
