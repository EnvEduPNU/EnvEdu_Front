import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "./DrawGraph.scss";
import GraphSelectionModal from "./GraphSelectionModal";
import SelectedGraph from "./SelectedGraph";
import { data } from "../sampleData/sampleData";

function GraphSelection() {
  const filterData = data.map((row, idx) => {
    return row.filter((col, index) =>
      JSON.parse(
        localStorage.getItem("dataLiteracy")
      ).drawGraph.selectedIdx.includes(index)
    );
  });
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [selectedGraph, setSelectedGraph] = useState(-1);

  // useEffect(() => {
  //   const dataLiteracy = JSON.parse(localStorage.getItem("dataLiteracy"));
  //   if (dataLiteracy === null) {
  //     // TODO: null일때 어떻게 할지 고민...
  //     return;
  //   }

  //   const filterData = dataLiteracy.sampleData.map((row, idx) => {
  //     return row.filter((col, index) =>
  //       dataLiteracy.drawGraph.selectedIdx.includes(index)
  //     );
  //   });

  //   setData(filterData);
  // }, []);

  const onClickGraphSelectionBtn = () => {
    setIsVisibleModal(state => !state);
  };

  return (
    <div className="graph-selection">
      <div className="buttons">
        <Button>추천 그래프 유형</Button>
        <Button onClick={onClickGraphSelectionBtn}>그래프 선택하기</Button>
      </div>
      <div className="data-list">
        <table className="myData-list">
          <thead>
            <tr>
              {filterData[0]?.map((key, idx) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filterData?.map((d, idx) => {
              if (idx < 1) return;
              return (
                <tr key={idx}>
                  {d.map(key => (
                    <td key={key}>{key}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {selectedGraph !== -1 && !isVisibleModal && (
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
