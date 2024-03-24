import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import Toolbar from "../ToolBar/Toolbar";
import * as Styled from "./Styled";
import { FormLabel } from "react-bootstrap";
import { useEClassStore } from "../../store/eClassStore";
import TrashSvg from "../../svg/TrashSvg";

const PaperWithToolBar = ({ pageNum, activities, eClassData }) => {
  const toggleSelected = useEClassStore(state => state.toggleSelected);
  const deleteActivity = useEClassStore(state => state.deleteActivity);

  const onChange = (index, key) => {
    toggleSelected(pageNum, index, key);
  };

  return (
    <Styled.Wrapper>
      <Toolbar pageNum={pageNum} />
      <Styled.Paper>
        {activities.map((activity, idx) =>
          eClassData[idx]?.isRemove ? (
            <div style={{ display: "none" }} key={idx}></div>
          ) : (
            <Styled.ActivityWrapper key={`${eClassData[idx]} ${idx}`}>
              <Styled.ActivityEditHeader>
                <Styled.ActivityCheckBoxWrapper>
                  {(eClassData[idx].classroomSequenceType === "DISCUSS" ||
                    eClassData[idx].classroomSequenceType === "QNA") && (
                    <>
                      <FormLabel style={{ cursor: "pointer", margin: 0 }}>
                        제출
                        <FormCheckInput
                          onChange={() => onChange(idx, "canSubmit")}
                          defaultChecked={eClassData[idx]["canSubmit"]}
                          style={{ marginLeft: "7px" }}
                        />
                      </FormLabel>
                      <FormLabel style={{ cursor: "pointer", margin: 0 }}>
                        공유
                        <FormCheckInput
                          onChange={() => onChange(idx, "canShare")}
                          defaultChecked={eClassData[idx]["canShare"]}
                          style={{ marginLeft: "7px" }}
                        />
                      </FormLabel>
                    </>
                  )}
                  <FormLabel style={{ cursor: "pointer", margin: 0 }}>
                    보고서
                    <FormCheckInput
                      onChange={() => onChange(idx, "studentVisibleStatus")}
                      defaultChecked={eClassData[idx]["studentVisibleStatus"]}
                      style={{ marginLeft: "7px" }}
                    />
                  </FormLabel>
                </Styled.ActivityCheckBoxWrapper>
                <TrashSvg
                  style={{ cursor: "pointer" }}
                  width={15}
                  onClick={() => deleteActivity(pageNum, idx)}
                />
              </Styled.ActivityEditHeader>
              <div>{activity}</div>
            </Styled.ActivityWrapper>
          )
        )}
      </Styled.Paper>
    </Styled.Wrapper>
  );
};

export default PaperWithToolBar;
