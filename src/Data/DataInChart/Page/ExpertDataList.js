import { useState, useEffect } from "react";
import "./leftSlidePage.scss";
import Dataset from "../../../DataLiteracy/DataLoad/Dataset/Dataset";
import ExpertDataModal from "../modal/ExpertDataModal";

export default function ExpertDataList(props) {
  /*데이터 요약 정보*/
  const [modalOpen, setModalOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  useEffect(() => {
    console.log("Expert Data List 모달 상태 : " + modalOpen);

    if (isFinished) {
      props.setIsFinished(isFinished);
      console.log("데이터 저장하고 올라오는 상태 : " + isFinished);
    }
  }, [modalOpen, isFinished]);

  const selectFolder = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ height: "10vh", width: "20vh" }}>
        <div style={{ marginTop: "1rem" }}>
          <img
            src="/assets/img/folder-icon.png"
            style={{ width: "1.5rem", margin: "0 0.5rem" }}
          />
          <label
            onClick={() => selectFolder()}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            전문가 데이터
          </label>
          {modalOpen ? (
            <ExpertDataModal
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              setIsFinished={setIsFinished}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
