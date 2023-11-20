import { useGraphDataStore } from "../../store/graphStore";
import CustomBarChart from "./CustomBarChart/CustomBarChart";
import CustomBubbleChart from "./CustomBarChart/CustomBubbleChart";
import CustomLineChart from "./CustomBarChart/CustomLineChart";
import CustomMixChart from "./CustomBarChart/CustomMixChart";
import CustomScatterChart from "./CustomBarChart/CustomScatterChart";

function CustomChart() {
  const graphIdx = useGraphDataStore(state => state.graphIdx);

  return (
    <>
      {graphIdx === 0 && <CustomBarChart />}
      {graphIdx === 1 && <CustomLineChart />}
      {graphIdx === 2 && <CustomBubbleChart />}
      {graphIdx === 4 && <CustomScatterChart />}
      {graphIdx === 5 && <CustomMixChart />}
    </>
  );
}

export default CustomChart;
