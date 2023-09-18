import { Line } from "react-chartjs-2";
import useCreateLineChart from "../../hooks/useCreateLineChart";

const LineChart = ({ data, qualitativeVariableIdx }) => {
  const { createDataset, createOptions, isShowChart } = useCreateLineChart(
    data,
    qualitativeVariableIdx
  );
  return (
    <div className="chart">
      {isShowChart() && (
        <Line
          data={{
            labels: data.slice(1).map(item => item[0]),
            datasets: createDataset(),
          }}
          options={createOptions()}
        />
      )}
    </div>
  );
};

export default LineChart;
