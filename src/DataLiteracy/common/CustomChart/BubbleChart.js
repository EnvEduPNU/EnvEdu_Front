import { Bubble } from "react-chartjs-2";
import useCreateBubbleChart from "../../hooks/useCreateBubbleChart";

const BubbleChart = ({ data, qualitativeVariableIdx }) => {
  const { createDataset, createOptions, isShowChart } = useCreateBubbleChart(
    data,
    qualitativeVariableIdx
  );

  return (
    <div className="chart">
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
