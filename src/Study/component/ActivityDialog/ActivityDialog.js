import * as Styled from "./Styled";
import Dialog from "../Dialog/Dialog";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import { useState } from "react";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";
import { useReportStore } from "../../store/reportStore";

function ActivityDialog({ visible, onClose, onConfirm, answer }) {
  const [selectedActivity, setSelectedAcitivity] = useState(-1);
  const { activities, writeAnswer } = useReportStore();

  const onSubmit = () => {
    onConfirm();
    writeAnswer(selectedActivity, answer);
  };

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      onConfirm={onSubmit}
      title={"답변을 제출할 활동을 선택하세요"}
      content={
        <Styled.ContentWrapper>
          {activities.map((activity, idx) => (
            <FormCheckLabel key={activity.question}>
              <FormCheckInput
                className="checkBox_"
                checked={idx === selectedActivity}
                onChange={() => setSelectedAcitivity(idx)}
              />{" "}
              {activity.question}
            </FormCheckLabel>
          ))}
        </Styled.ContentWrapper>
      }
    />
  );
}

export default ActivityDialog;
