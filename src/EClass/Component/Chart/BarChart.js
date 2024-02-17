import { Bar } from "react-chartjs-2";
import createBarData from "../../utils/createBarData";

function BarChart({ graphDataState, barDataState, metaDataState }) {
  const { data, options } = createBarData(
    graphDataState,
    barDataState,
    metaDataState
  );
  return (
    <Bar
      style={{ width: "100%", height: "100%" }}
      data={data}
      options={options}
    />
  );
}

export default BarChart;
