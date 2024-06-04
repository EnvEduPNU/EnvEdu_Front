import { useState, useEffect } from "react";
import { customAxios } from "../../../Common/CustomAxios";
import "./leftSlidePage.scss";
import FolderList from "../../MyData/folderList";
import ForderListModal from "../modal/ForderListModal";
import Header from "../component/Header/Header";

export default function LeftSlidePage() {
  /*데이터 요약 정보*/
  const [summary, setSummary] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    customAxios
      .get("/mydata/list")
      .then((res) => {
        const formattedData = res.data.map((data) => ({
          ...data,
          saveDate: data.saveDate.split("T")[0],
          dataLabel:
            data.dataLabel === "AIRQUALITY"
              ? "대기질 데이터"
              : data.dataLabel === "OCEANQUALITY"
              ? "수질 데이터"
              : data.dataLabel,
        }));
        setSummary(formattedData);
      })
      .catch((err) => console.log(err));
  }, []);

  // 전체 데이터 리스트 가져온 것중에서 데이터 라벨에 따라 필터링해서 뽑아서 보내준다.
  const [filteredData, setFilteredData] = useState([]);
  const selectFolder = (type) => {
    let filtered = [];
    if (type === "전체") {
      filtered = summary;
      summary.unshift({ total: "전체" });
    } else if (type == "대기질") {
      filtered = summary.filter((data) => data.dataLabel === "대기질 데이터");
    } else if (type == "수질") {
      filtered = summary.filter((data) => data.dataLabel === "수질 데이터");
    } else if (type == "SEED") {
      filtered = summary.filter((data) => data.dataLabel === "SEED");
    } else if (type == "CUSTOM") {
      filtered = summary.filter((data) => data.dataLabel === "CUSTOM");
    }
    console.log("필터에 뭐가 있나 : " + filtered);

    if (filtered == "") {
      filtered.unshift({ none: type });
      setFilteredData(filtered);
      setModalOpen(true);
      console.log("데이터 없음");
    } else {
      setFilteredData(filtered);
      setModalOpen(true);
    }
  };

  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const handleFolderSelect = (folderId) => {
    console.log("뭐가 어떻게 되는거야 이건 : " + folderId);
    setSelectedFolderId(folderId);
  };

  return (
    <div className="e-class-mydata">
      <Header />

      {/*folder + 데이터 요약 정보*/}
      <div className="myData-left">
        {/*데이터 요약 정보*/}
        <div className="myData-summary">
          <h4>My Data</h4>
          <div style={{ display: "flex" }}>
            <div style={{ height: "50vh", width: "20vh" }}>
              <div style={{ marginTop: "1rem" }}>
                <img
                  src="/assets/img/folder-icon.png"
                  style={{ width: "1.5rem", margin: "0 0.5rem" }}
                />
                <label
                  onClick={() => selectFolder("전체")}
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  전체
                </label>
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <img
                  src="/assets/img/folder-icon.png"
                  style={{ width: "1.5rem", margin: "0 0.5rem" }}
                />
                <label
                  onClick={() => selectFolder("대기질")}
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  대기질
                </label>
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <img
                  src="/assets/img/folder-icon.png"
                  style={{
                    width: "1.5rem",
                    margin: "0 0.5rem",
                    cursor: "pointer",
                  }}
                />
                <label
                  onClick={() => selectFolder("수질")}
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  수질
                </label>
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <img
                  src="/assets/img/folder-icon.png"
                  style={{ width: "1.5rem", margin: "0 0.5rem" }}
                />
                <label
                  onClick={() => selectFolder("SEED")}
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  SEED
                </label>
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <img
                  src="/assets/img/folder-icon.png"
                  style={{
                    width: "1.5rem",
                    margin: "0 0.5rem",
                    cursor: "pointer",
                  }}
                />
                <label
                  onClick={() => selectFolder("CUSTOM")}
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  CUSTOM
                </label>
              </div>

              <div className="myData-folder">
                <FolderList
                  onSelectFolder={handleFolderSelect}
                  onClicked={selectedFolderId}
                />
              </div>
            </div>

            {filteredData.length > 0 && (
              <ForderListModal
                filteredData={filteredData}
                modalOpen={modalOpen}
              />
            )}
          </div>
        </div>
      </div>

      {/*
            <div className='myData-right'>
                {details.length !== 0 && 
                    <>
                        <table border="1" className='myData-detail'>
                            <thead>
                                <tr>
                                    {headers.map((header) => (
                                        <th key={header}>{engToKor(header)}</th>
                                    ))}
                                </tr>
                            </thead>
                            
                            <tbody>
                                {details.map((item) => (
                                    <tr key={item.id}>
                                        {headers.map((header) => (
                                            <td key={header}>{item[header]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                }
            </div>
            */}
    </div>
  );
}
