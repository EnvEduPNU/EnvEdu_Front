import { Scatter } from "react-chartjs-2";
import useCreateScatterChart from "../../hooks/useCreateScatterChart";

const ScatterChart = ({ data, qualitativeVariableIdx }) => {
  const { createDataset, createOptions, isShowChart } = useCreateScatterChart(
    data,
    qualitativeVariableIdx
  );
  return (
    <div className="chart">
      {isShowChart() && (
        <Scatter
          data={{ datasets: createDataset() }}
          options={createOptions()}
        />
      )}
    </div>
  );
};

export default ScatterChart;
