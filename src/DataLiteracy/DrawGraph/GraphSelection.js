import { useState } from "react";
import { Button } from "react-bootstrap";
import "./DrawGraph.scss";
import GraphSelectionModal from "./GraphSelectionModal";
import SelectedGraph from "./SelectedGraph";
import { data } from "../sampleData/sampleData";

function GraphSelection() {
  const localStorageData = JSON.parse(localStorage.getItem("drawGraph")) || {};

  const filterData = data.map(row => {
    return row.filter((_, index) =>
      localStorageData.selectedVariable?.includes(index)
    );
  });

  // 초기 상태 값 설정
  const initialSelectedGraph =
    localStorageData.selectedGraph > -1 ? localStorageData.selectedGraph : -1;

  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [selectedGraph, setSelectedGraph] = useState(initialSelectedGraph);

  const onClickGraphSelectionBtn = () => {
    setIsVisibleModal(state => !state);
  };

  return (
    <div className="graph-selection">
      <div className="buttons">
        <Button>추천 그래프 유형</Button>
        <Button onClick={onClickGraphSelectionBtn}>그래프 선택하기</Button>
      </div>
      <div className={selectedGraph !== -1 ? "data-list grid" : "data-list"}>
        <table className="myData-list">
          <thead>
            <tr>
              {filterData[0].map((key, idx) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filterData.slice(1).map((d, idx) => (
              <tr key={idx}>
                {d.map(key => (
                  <td key={key}>{key}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {selectedGraph !== -1 && (
          <div className="graph">
            <SelectedGraph data={filterData} graph={selectedGraph} />
          </div>
        )}
      </div>
      {isVisibleModal && (
        <GraphSelectionModal
          selectedGraph={selectedGraph}
          setSelectedGraph={setSelectedGraph}
          setIsVisibleModal={setIsVisibleModal}
        />
      )}
    </div>
  );
}

export default GraphSelection;
