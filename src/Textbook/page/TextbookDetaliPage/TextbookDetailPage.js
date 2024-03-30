import { useLocation } from "react-router-dom";
import * as Styled from "./Styled";
import CustomTable from "../../components/CustomTable/CustomTable";
import Description from "../../components/Description/Description";
import { useEffect } from "react";

function TextbookDetailPage() {
  const {
    state: { textbookData },
  } = useLocation();

  return (
    <Styled.Wrapper>
      <Styled.Top>
        <Description
          title={textbookData.title}
          description={textbookData.content}
          data={textbookData.tableData}
        />
      </Styled.Top>

      <CustomTable data={textbookData.tableData} />
    </Styled.Wrapper>
  );
}

export default TextbookDetailPage;
