import { Bar, Bubble, Doughnut, Line, Scatter } from "react-chartjs-2";

function SelectedGraph({ data, graph }) {
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
              .map(item => ({ x: item[1], y: item[2], r: item[3] / 10 }))
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
      datasets[0].yAxisID = "y1"; // 첫 번째 데이터셋(선 그래프)를 첫 번째 y축에 연결
    }
    if (datasets.length > 1) {
      datasets[1].yAxisID = "y2"; // 두 번째 데이터셋(막대 그래프)를 두 번째 y축에 연결
    }

    return (
      <Bar
        data={{
          labels,
          datasets,
        }}
        options={{
          scales: {
            y1: {
              beginAtZero: true,
              position: "left",
              id: "y1",
            },
            y2: {
              beginAtZero: true,
              position: "right",
              grid: {
                drawOnChartArea: false, // 오른쪽 y축의 그리드 라인을 숨김
              },
              display: true,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    );
  };

  return (
    <div style={{ width: "650px" }}>
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

export default SelectedGraph;
