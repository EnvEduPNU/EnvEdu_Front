import { Chart } from "chart.js";
import { Bar, Bubble, Doughnut, Line, Scatter } from "react-chartjs-2";

function DrawGraph({ data, graph }) {
  const labels = data.slice(1).map(item => item[0]);

  const randomColor = (transparency = 0.5) =>
    `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    }, ${transparency})`;

  const createDatasets = (type = "bar") =>
    data[0].slice(1).map((label, idx) => ({
      label,
      data:
        type === "bubble"
          ? data
              .slice(1)
              .map(item => ({ x: item[1], y: item[2], r: item[3] / 50 }))
          : type == "scatter"
          ? data.slice(1).map(item => ({ x: item[1], y: item[2] }))
          : data.slice(1).map(item => item[idx + 1]),
      backgroundColor: randomColor(),
      borderColor: randomColor(),
      borderWidth: 1,
    }));

  const MixedChartComponent = () => {
    const datasets = createDatasets();
    if (datasets.length > 0) {
      datasets[0].type = "line";
    }
    return (
      <Chart
        type="bar"
        data={{
          labels,
          datasets,
        }}
      />
    );
  };

  return (
    <div style={{ width: "600px", height: "400px" }}>
      {graph === 0 && (
        <Bar
          data={{
            labels,
            datasets: createDatasets("bar"),
          }}
        />
      )}
      {graph === 1 && (
        <Line
          data={{
            labels,
            datasets: createDatasets("line"),
          }}
        />
      )}
      {graph === 2 && (
        <Bubble
          data={{
            labels,
            datasets: createDatasets("bubble"),
          }}
        />
      )}
      {graph === 3 && (
        <Doughnut
          data={{
            labels,
            datasets: createDatasets("doughnut"),
          }}
        />
      )}
      {graph === 4 && (
        <Scatter
          data={{
            datasets: createDatasets("scatter"),
          }}
          options={{
            scales: {
              x: {
                type: "linear",
                position: "bottom",
              },
            },
          }}
        />
      )}
      {graph === 5 && <MixedChartComponent />}
    </div>
  );
}

export default DrawGraph;
