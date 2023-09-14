import { Bar, Bubble, Doughnut, Line, Scatter } from "react-chartjs-2";

function SelectedGraph({ data, graph }) {
  const labels = data.slice(1).map(item => item[0]);

  const randomColor = (transparency = 0.5) =>
    `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    }, ${transparency})`;

  const createDatasets = (type = "bar") => {
    if (type === "scatter") {
      return [
        {
          label: "산점도 그래프",
          data: data
            .slice(1)
            .map(item => ({ x: item[1], y: item[2], label: item[0] })),
          backgroundColor: randomColor(),
          borderColor: randomColor(),
          borderWidth: 1,
        },
      ];
    }
    if (type === "bubble") {
      return [
        {
          label: "버블 그래프",
          data: data.slice(1).map(item => ({
            x: item[1],
            y: item[2],
            r: item[3] / 10,
            label: item[0],
          })),
          backgroundColor: randomColor(),
          borderWidth: 1,
        },
      ];
    }
    if (type === "doughnut") {
      const backgroundColor = labels.map(() => randomColor());
      return data[0].slice(1).map((label, idx) => ({
        label,
        data: data.slice(1).map(item => item[idx + 1]),
        backgroundColor,
        borderWidth: 1,
      }));
    }
    return data[0].slice(1).map((label, idx) => ({
      label,
      data: data.slice(1).map(item => item[idx + 1]),
      backgroundColor: randomColor(),
      borderWidth: 1,
    }));
  };

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
  console.log(createDatasets("scatter"));
  return (
    <>
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
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const point = context.dataset.data[context.dataIndex];
                    const label = point.label;
                    const xValue = context.parsed.x;
                    const yValue = context.parsed.y;
                    const rValue = point.r;
                    return `${label}: (${xValue}, ${yValue}, ${rValue})`;
                  },
                },
              },
            },
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
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.dataset.data[context.dataIndex].label;
                    const xValue = context.parsed.x;
                    const yValue = context.parsed.y;
                    return `${label}: (${xValue}, ${yValue})`;
                  },
                },
              },
            },
          }}
        />
      )}
      {graph === 5 && <MixedChartComponent />}
    </>
  );
}

export default SelectedGraph;
