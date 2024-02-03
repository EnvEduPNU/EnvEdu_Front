import * as Styled from "./Styled";
import Dialog from "../../../Study/component/Dialog/Dialog";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import { useEClassStore } from "../../store/eClassStore";
import { useState } from "react";
import Table from "../Table/Table";

function AppendActivityDialog({ visible, onClose, onConfirm, answer }) {
  const [selectedActivity, setSelectedAcitivity] = useState(-1);
  const { eClass, appendActivity } = useEClassStore();

  const onSubmit = () => {
    onConfirm();
    appendActivity(selectedActivity, <Table tableData={answer} />);
  };
  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      onConfirm={onSubmit}
      title={"활동을 추가할 페이지를 선택하세요"}
      content={
        <Styled.ContentWrapper>
          {eClass.map((page, idx) => (
            <FormCheckLabel key={idx}>
              <FormCheckInput
                className="checkBox_"
                checked={idx === selectedActivity}
                onChange={() => setSelectedAcitivity(idx)}
              />
              {idx + 1} 페이지
            </FormCheckLabel>
          ))}
        </Styled.ContentWrapper>
      }
    />
  );
}

export default AppendActivityDialog;
