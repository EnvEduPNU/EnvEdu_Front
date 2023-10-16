import { Bar } from "react-chartjs-2";
import useCreateMixChart from "../../hooks/useCreateMixChart";

const MixChart = ({ data, qualitativeVariableIdx }) => {
  const { createDataset, createOptions, isShowChart } = useCreateMixChart(
    data,
    qualitativeVariableIdx
  );

  return (
    <div className="chart">
      {isShowChart() && (
        <Bar
          style={{ height: "350px" }}
          data={{
            labels: data.slice(1).map(item => item[qualitativeVariableIdx]),
            datasets: createDataset(),
          }}
          options={createOptions()}
        />
      )}
    </div>
  );
};

export default MixChart;
