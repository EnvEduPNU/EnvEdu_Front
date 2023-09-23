import BarChart from "./BarChart";
import BubbleChart from "./BubbleChart";
import LineChart from "./LineChart";
import MixChart from "./MixChart";
import ScatterChart from "./ScatterChart";

function CustomChart({ data }) {
  const localStorageData = JSON.parse(localStorage.getItem("drawGraph")) || {};
  const graph = localStorageData?.selectedGraph;

  return (
    <>
      {graph === 0 && <BarChart data={data} qualitativeVariableIdx={0} />}
      {graph === 1 && <LineChart data={data} qualitativeVariableIdx={0} />}
      {graph === 2 && <BubbleChart data={data} qualitativeVariableIdx={0} />}
      {graph === 4 && <ScatterChart data={data} qualitativeVariableIdx={0} />}
      {graph === 5 && <MixChart data={data} qualitativeVariableIdx={0} />}
    </>
  );
}

export default CustomChart;
