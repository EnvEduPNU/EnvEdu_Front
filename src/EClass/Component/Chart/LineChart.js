import { Line } from "react-chartjs-2";
import createLineData from "../../utils/createLineData";

function LineChart({ graphDataState, lineDataState, metaDataState }) {
  const { data, options } = createLineData(
    graphDataState,
    lineDataState,
    metaDataState
  );

  return (
    <Line
      style={{ width: "100%", height: "100%" }}
      data={data}
      options={options}
    />
  );
}

export default LineChart;
