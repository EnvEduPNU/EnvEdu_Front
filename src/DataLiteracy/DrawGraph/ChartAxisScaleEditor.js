import Table from "../common/Table/Table";
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
      <Table head={filterData[0]} body={filterData.slice(1)} />
      <GraphAxisScaleEditor />
    </div>
  );
}

export default ChartAxisScaleEditor;
