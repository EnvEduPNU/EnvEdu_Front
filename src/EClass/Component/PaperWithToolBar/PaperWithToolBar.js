import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import Toolbar from "../ToolBar/Toolbar";
import * as Styled from "./Styled";
import { FormLabel } from "react-bootstrap";

const PaperWithToolBar = ({ pageNum, activities }) => {
  return (
    <Styled.Wrapper>
      <Toolbar pageNum={pageNum} />
      <Styled.Paper>
        {activities.map((activity, idx) => (
          <Styled.ActivityWrapper key={idx}>
            <Styled.ActivityEditHeader>
              <FormLabel style={{ cursor: "pointer" }}>
                {/* <span>학생 보고서</span> */}
                <FormCheckInput defaultChecked style={{ marginLeft: "7px" }} />
              </FormLabel>
            </Styled.ActivityEditHeader>
            <div>{activity}</div>
          </Styled.ActivityWrapper>
        ))}
      </Styled.Paper>
    </Styled.Wrapper>
  );
};

export default PaperWithToolBar;
