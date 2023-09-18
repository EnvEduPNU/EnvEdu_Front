import { Bubble } from "react-chartjs-2";
import useCreateBubbleChart from "../../hooks/useCreateBubbleChart";

const BubbleChart = ({ data, qualitativeVariableIdx }) => {
  const { createDataset, createOptions, isShowChart } = useCreateBubbleChart(
    data,
    qualitativeVariableIdx
  );

  return (
    <div className="chart" style={{ minWidth: "100%", minHeight: "100%" }}>
      {isShowChart && (
        <Bubble
          data={{ datasets: createDataset() }}
          options={createOptions()}
        />
      )}
    </div>
  );
};

export default BubbleChart;
