import { useLocation } from "react-router-dom";
import * as Styled from "./Styled";
import CustomTable from "../../components/CustomTable/CustomTable";
import Description from "../../components/Description/Description";

function TextbookDetailPage() {
  const {
    state: { textbookData },
  } = useLocation();

  return (
    <Styled.Wrapper>
      <Description
        title={textbookData.title}
        description={textbookData.description}
      />
      <CustomTable data={textbookData.tableData} />
    </Styled.Wrapper>
  );
}

export default TextbookDetailPage;
