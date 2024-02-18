import { Scatter } from "react-chartjs-2";
import createScatterData from "../../utils/createScatterData";

function ScatterChart({ graphDataState, scatterDataState, metaDataState }) {
  const { data, options } = createScatterData(
    graphDataState,
    scatterDataState,
    metaDataState
  );

  console.log(options);

  return (
    <Scatter
      style={{ width: "100%", height: "100%" }}
      data={data}
      options={options}
    />
  );
}

export default ScatterChart;
