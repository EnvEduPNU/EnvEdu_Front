import { Bubble } from "react-chartjs-2";
import createBubbleData from "../../utils/createBubbleData";

function BubbleChart({ graphDataState, bubbleDataState, metaDataState }) {
  const { data, options } = createBubbleData(
    graphDataState,
    bubbleDataState,
    metaDataState
  );
  return (
    <Bubble
      style={{ width: "100%", height: "100%" }}
      data={data}
      options={options}
    />
  );
}

export default BubbleChart;
