import { useState } from "react";
import { Button } from "react-bootstrap";
import "./DrawGraph.scss";
import GraphSelectionModal from "./GraphSelectionModal";
import { data } from "../sampleData/sampleData";
import Table from "../common/Table/Table";

function GraphSelection({ next }) {
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
      <div className={"data-list"}>
        <Table head={filterData[0]} body={filterData.slice(1)} />
      </div>
      {isVisibleModal && (
        <GraphSelectionModal
          selectedGraph={selectedGraph}
          setSelectedGraph={setSelectedGraph}
          setIsVisibleModal={setIsVisibleModal}
          next={next}
        />
      )}
    </div>
  );
}

export default GraphSelection;
