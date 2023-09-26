import { Bar } from "react-chartjs-2";
import useCreateBarChart from "../../hooks/useCreateBarChart";

const BarChart = ({ data, qualitativeVariableIdx }) => {
  const { createDataset, createOptions, isShowChart } = useCreateBarChart(
    data,
    qualitativeVariableIdx
  );

  return (
    <div className="chart">
      {isShowChart() && (
        <Bar
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

export default BarChart;
