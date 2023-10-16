import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import Table from "../common/Table/Table";
import { data } from "../sampleData/sampleData";
import { useChartMetaDataStore } from "../store/drawGraphStore";
import LineChart from "../common/CustomChart/LineChart";
import BarChart from "../common/CustomChart/BarChart";
import ScatterChart from "../common/CustomChart/ScatterChart";
import BubbleChart from "../common/CustomChart/BubbleChart";
import MixChart from "../common/CustomChart/MixChart";

const ChartMetadataEditor = () => {
  const {
    metaData: { tableTitle, chartTitle, legendPostion, datalabelAnchor },
    changeTitle,
    changeLegendPosition,
    changeDatalabelAnchor,
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
      case "오른쪽":
        return "right";
      default:
        return "no";
    }
  };

  const changeEnglishAnchor = anchor => {
    switch (anchor) {
      case "위":
        return "end";
      case "아래":
        return "start";
      case "중간":
        return "center";
      default:
        return "no";
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
          {["표시안함", "위", "아래", "왼쪽", "오른쪽"].map(position => (
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
        <div className="legend-location">
          <span>레이블 위치: </span>
          {["표시안함", "위", "중간", "아래"].map(anchor => (
            <label key={anchor} className="location-label">
              <div>{anchor}</div>
              <FormCheckInput
                checked={changeEnglishAnchor(anchor) === datalabelAnchor}
                onChange={e =>
                  changeDatalabelAnchor(changeEnglishAnchor(anchor))
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
        {graph === 5 && (
          <MixChart data={filterData} qualitativeVariableIdx={0} />
        )}
      </div>
    </div>
  );
};

export default ChartMetadataEditor;
