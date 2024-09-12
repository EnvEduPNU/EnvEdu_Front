import { useGraphDataStore } from "../../store/graphStore";
import CustomBarChart from "./CustomBarChart";
import CustomBubbleChart from "./CustomBubbleChart";
import CustomLineChart from "./CustomLineChart";
import CustomMixChart from "./CustomMixChart";
import CustomScatterChart from "./CustomScatterChart";

function CustomChart() {
  const graphIdx = useGraphDataStore(state => state.graphIdx);

  return (
    <div className="chart">
      {graphIdx === 0 && <CustomBarChart />}
      {graphIdx === 1 && <CustomLineChart />}
      {graphIdx === 2 && <CustomBubbleChart />}
      {graphIdx === 4 && <CustomScatterChart />}
      {graphIdx === 5 && <CustomMixChart />}
    </div>
  );
}

export default CustomChart;
