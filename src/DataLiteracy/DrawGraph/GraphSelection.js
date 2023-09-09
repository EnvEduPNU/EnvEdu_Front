import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "./DrawGraph.scss";
import GraphSelectionModal from "./GraphSelectionModal";
import { Bar, Doughnut, Line, Scatter } from "react-chartjs-2";
import DrawGraph from "./DrawGraph";

function GraphSelection() {
  const [data, setData] = useState([[]]);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [selectedGraph, setSelectedGraph] = useState(-1);
  const [labels, setLabels] = useState();
  const [datasets, setDatasets] = useState();

  console.log(datasets);
  const randomColor = (transparency = 0.5) =>
    `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    }, ${transparency})`;

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
    console.log(filterData.slice(1));
    setLabels(filterData.slice(1).map(d => d[0]));
    setDatasets(
      filterData[0].slice(1).map((label, idx) => ({
        label,
        data: filterData.slice(1).map(d => d[idx + 1]),
        backgroundColor: randomColor(),
        borderColor: randomColor(),
        borderWidth: 1,
      }))
    );
    setData(filterData);
  }, []);

  const onClickGraphSelectionBtn = () => {
    setIsVisibleModal(state => !state);
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
        {selectedGraph !== -1 && !isVisibleModal && (
          <DrawGraph data={data} graph={selectedGraph} />
        )}
      </div>
      {isVisibleModal && (
        <GraphSelectionModal
          setSelectedGraph={setSelectedGraph}
          setIsVisibleModal={setIsVisibleModal}
        />
      )}
    </div>
  );
}

export default GraphSelection;
