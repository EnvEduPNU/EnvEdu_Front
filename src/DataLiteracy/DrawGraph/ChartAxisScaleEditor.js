import { data } from "../sampleData/sampleData";
import BarAxisScaleEditor from "./AxisScaleEditor/BarAxisScaleEditor";
import BubbleAxisScaleEditor from "./AxisScaleEditor/BubbleAxisScaleEditor";
import LineAxisScaleEditor from "./AxisScaleEditor/LineAxisScaleEditor";
import MixChartAxisScaleEditor from "./AxisScaleEditor/MixChartAxisScaleEditor";
import ScatterAxisScaleEditor from "./AxisScaleEditor/ScatterAxisScaleEditor";

function ChartAxisScaleEditor() {
  const localStorageData = JSON.parse(localStorage.getItem("drawGraph")) || {};

  const filterData = data.map(row => {
    return row.filter((_, index) =>
      localStorageData.selectedVariable?.includes(index)
    );
  });
  const selectedGraph = Number(
    JSON.parse(localStorage.getItem("drawGraph")).selectedGraph
  );
  const GraphAxisScaleEditor = () => {
    switch (selectedGraph) {
      case 0:
        return (
          <BarAxisScaleEditor
            data={filterData}
            qualitativeVariableIdx={qualitativeVariableIdx}
          />
        );
      case 1:
        return (
          <LineAxisScaleEditor
            data={filterData}
            qualitativeVariableIdx={qualitativeVariableIdx}
          />
        );
      case 2:
        return (
          <BubbleAxisScaleEditor
            data={filterData}
            qualitativeVariableIdx={qualitativeVariableIdx}
          />
        );
      case 3:
        return (
          <BarAxisScaleEditor
            data={filterData}
            qualitativeVariableIdx={qualitativeVariableIdx}
          />
        );
      case 4:
        return (
          <ScatterAxisScaleEditor
            data={filterData}
            qualitativeVariableIdx={qualitativeVariableIdx}
          />
        );
      default:
        return (
          <MixChartAxisScaleEditor
            data={filterData}
            qualitativeVariableIdx={qualitativeVariableIdx}
          />
        );
    }
  };

  const qualitativeVariableIdx = 0;
  return (
    <div className="chartAxisScaleEditor">
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
      <GraphAxisScaleEditor />
    </div>
  );
}

export default ChartAxisScaleEditor;
