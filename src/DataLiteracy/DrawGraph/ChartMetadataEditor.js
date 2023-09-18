import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import Table from "../common/Table/Table";
import { data } from "../sampleData/sampleData";
import { useChartMetaDataStore } from "../store/drawGraphStore";
import LineChart from "./CustomChart/LineChart";
import BarChart from "./CustomChart/BarChart";
import ScatterChart from "./CustomChart/ScatterChart";
import BubbleChart from "./CustomChart/BubbleChart";

const ChartMetadataEditor = () => {
  const {
    metaData: { tableTitle, chartTitle, legendPostion },
    changeTitle,
    changeLegendPosition,
  } = useChartMetaDataStore();
  const localStorageData = JSON.parse(localStorage.getItem("drawGraph")) || {};
  const graph = localStorageData?.selectedGraph;

  const filterData = data.map(row => {
    return row.filter((_, index) =>
      localStorageData.selectedVariable?.includes(index)
    );
  });

  const changeEnglishPostion = position => {
    switch (position) {
      case "위":
        return "top";
      case "아래":
        return "bottom";
      case "왼쪽":
        return "left";
      default:
        return "right";
    }
  };
  return (
    <div className="chartMetadataEditor">
      <div className="chartMetadataEditor-table">
        <label className="title-label">
          <span>표 제목: </span>
          <input
            type="text"
            value={tableTitle}
            onChange={e => changeTitle("table", e.target.value)}
          />
        </label>
        <Table head={filterData[0]} body={filterData.slice(1)} />
      </div>

      <div className="chartMetadataEditor-chart">
        <label className="title-label">
          <span>그래프 제목:</span>
          <input
            type="text"
            value={chartTitle}
            onChange={e => changeTitle("chart", e.target.value)}
          />
        </label>
        <div className="legend-location">
          <span>범례 위치: </span>
          {["위", "아래", "왼쪽", "오른쪽"].map(position => (
            <label key={position} className="location-label">
              <div>{position}</div>
              <FormCheckInput
                checked={changeEnglishPostion(position) === legendPostion}
                onChange={e =>
                  changeLegendPosition(changeEnglishPostion(position))
                }
              />
            </label>
          ))}
        </div>
        {graph === 0 && (
          <BarChart data={filterData} qualitativeVariableIdx={0} />
        )}
        {graph === 1 && (
          <LineChart data={filterData} qualitativeVariableIdx={0} />
        )}
        {graph === 2 && (
          <BubbleChart data={filterData} qualitativeVariableIdx={0} />
        )}
        {graph === 4 && (
          <ScatterChart data={filterData} qualitativeVariableIdx={0} />
        )}
      </div>
    </div>
  );
};

export default ChartMetadataEditor;
