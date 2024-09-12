import { useState, useEffect } from "react";
import "./leftSlidePage.scss";
import ExpertDataModal from "../modal/ExpertDataModal";

export default function ExpertDataList({ setDataCategory }) {
  /*데이터 요약 정보*/
  const [modalOpen, setModalOpen] = useState(false);

  const selectFolder = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div style={{ display: "flex" }}>
      <ExpertDataModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        setDataCategory={setDataCategory}
      />
      <div style={{ height: "10vh", width: "20vh" }}>
        <div style={{ marginTop: "1rem" }} className="flex">
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
        </div>
      </div>
    </div>
  );
}
