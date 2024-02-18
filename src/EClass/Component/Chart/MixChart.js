import { Bar } from "react-chartjs-2";
import createMixData from "../../utils/createMixData";

function MixChart({ graphDataState, mixDataState, metaDataState }) {
  const { data, options } = createMixData(
    graphDataState,
    mixDataState,
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

export default MixChart;
