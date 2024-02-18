import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import Toolbar from "../ToolBar/Toolbar";
import * as Styled from "./Styled";
import { FormLabel } from "react-bootstrap";
import { useEClassStore } from "../../store/eClassStore";

const PaperWithToolBar = ({ pageNum, activities, eClassData }) => {
  const toggleSelected = useEClassStore(state => state.toggleSelected);

  const onChange = index => {
    toggleSelected(pageNum, index);
  };
  return (
    <Styled.Wrapper>
      <Toolbar pageNum={pageNum} />
      <Styled.Paper>
        {activities.map((activity, idx) => (
          <Styled.ActivityWrapper key={idx}>
            <Styled.ActivityEditHeader>
              <FormLabel style={{ cursor: "pointer" }}>
                <FormCheckInput
                  onChange={() => onChange(idx)}
                  defaultChecked={eClassData[idx]["studentVisibleStatus"]}
                  style={{ marginLeft: "7px" }}
                />
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
