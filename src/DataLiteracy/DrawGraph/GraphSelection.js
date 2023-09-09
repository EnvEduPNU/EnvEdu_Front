import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "./DrawGraph.scss";
import GraphSelectionModal from "./GraphSelectionModal";

function GraphSelection() {
  const [data, setData] = useState([[]]);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [selectedGraph, setSelectedGraph] = useState(-1);

  useEffect(() => {
    const dataLiteracy = JSON.parse(localStorage.getItem("dataLiteracy"));
    if (dataLiteracy === null) {
      // TODO: null일때 어떻게 할지 고민...
      return;
    }

    const filterData = dataLiteracy.sampleData.map((row, idx) => {
      return row.filter((col, index) =>
        dataLiteracy.drawGraph.selectedIdx.includes(index)
      );
    });
    setData(filterData);
  }, []);

  const onClickGraphSelectionBtn = () => {
    setIsVisibleModal(state => !state);
  };

  const drwaGraph = () => {
    if (selectedGraph === -1) return;
  };
  return (
    <div className="graph-selection">
      <div className="buttons">
        <Button>추천 그래프 유형</Button>
        <Button onClick={onClickGraphSelectionBtn}>그래프 선택하기</Button>
      </div>
      <div>
        <table className="myData-list">
          <thead>
            <tr>
              {data[0]?.map((key, idx) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((d, idx) => {
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
        {/* <Button onClick={onClickButton}>다음</Button> */}
        {isVisibleModal && (
          <GraphSelectionModal
            setSelectedGraph={setSelectedGraph}
            setIsVisibleModal={setIsVisibleModal}
          />
        )}
      </div>
    </div>
  );
}

export default GraphSelection;
