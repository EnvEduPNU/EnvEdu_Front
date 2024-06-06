import { useState, useEffect } from "react";
import { customAxios } from "../../../Common/CustomAxios";
import "./leftSlidePage.scss";
import FolderList from "../../MyData/folderList";
import ForderListModal from "../modal/ForderListModal";
import Header from "../component/Header/Header";
import Dataset from "../../../DataLiteracy/DataLoad/Dataset/Dataset";

export default function ExpertDataList(props) {
  /*데이터 요약 정보*/
  const [summary, setSummary] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {}, []);

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
          {modalOpen ? <Dataset /> : ""}
        </div>
      </div>
    </div>
  );
}
