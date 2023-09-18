import { FormCheck, InputGroup } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { useMixChartAxisScaleEditorStore } from "../../store/drawGraphStore";

function MixChartAxisScaleEditor({ data, qualitativeVariableIdx }) {
  const {
    axisScale: { x, y1, y2, barChart, lineChart },
    changeAxisValue,
    changeAxisScale,
    changeChart,
  } = useMixChartAxisScaleEditorStore();

  const variables = data[qualitativeVariableIdx];

  const randomColor = (transparency = 0.5) =>
    `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    }, ${transparency})`;

  const createDataset = () => {
    const datasets = data[0].slice(1).map((label, idx) => ({
      label,
      data: data.slice(1).map(item => item[idx + 1]),
      backgroundColor: randomColor(),
      borderWidth: 1,
    }));

    y1.value.forEach(v => {
      datasets[v - 1].yAxisID = "y1";
    });

    y2.value.forEach(v => {
      datasets[v - 1].yAxisID = "y2";
    });

    lineChart.forEach(idx => {
      datasets[idx - 1].type = "line";
    });
    barChart.forEach(idx => {
      datasets[idx - 1].type = "bar";
    });

    return datasets;
  };

  const createOption = () => {
    return {
      scales: {
        y1: {
          position: "left",
          id: "y1",
          min: y1.min,
          max: y1.max,
          ticks: {
            stepSize: y1.stepSize,
            autoSkip: false,
          },
        },
        y2: {
          position: "right",
          grid: {
            drawOnChartArea: false, // 오른쪽 y축의 그리드 라인을 숨김
          },
          display: true,
          min: y2.min,
          max: y2.max,
          ticks: {
            stepSize: y2.stepSize,
            autoSkip: false,
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  };

  return (
    <div className="mixChartAxisScaleEditor axisScaleEditor">
      <div className="variables-checkBox">
        <span className="title">X축: </span>
        <div className="variables">
          {variables.map((variable, idx) => (
            <label
              className={
                !y1.value.includes(idx) && !y2.value.includes(idx)
                  ? "variable"
                  : "variable disabled"
              }
              key={variable}
            >
              <FormCheck
                disabled={y1.value.includes(idx) || y2.value.includes(idx)}
                checked={x.value === idx}
                onChange={() =>
                  changeAxisValue("x", idx, qualitativeVariableIdx)
                }
              />
              <span>{variable}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="variables-checkBox">
        <span className="title">Y1축: </span>
        <div className="variables">
          {variables.map((variable, idx) => (
            <label
              className={
                x.value !== idx && !y2.value.includes(idx)
                  ? "variable"
                  : "variable disabled"
              }
              key={variable}
            >
              <FormCheck
                disabled={x.value === idx || y2.value.includes(idx)}
                checked={y1.value.includes(idx)}
                onChange={() =>
                  changeAxisValue("y1", idx, qualitativeVariableIdx)
                }
              />
              <span>{variable}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="variables-checkBox">
        <span className="title">Y2축: </span>
        <div className="variables">
          {variables.map((variable, idx) => (
            <label
              className={
                x.value !== idx && !y1.value.includes(idx)
                  ? "variable"
                  : "variable disabled"
              }
              key={variable}
            >
              <FormCheck
                disabled={x.value === idx || y1.value.includes(idx)}
                checked={y2.value.includes(idx)}
                onChange={() =>
                  changeAxisValue("y2", idx, qualitativeVariableIdx)
                }
              />
              <span>{variable}</span>
            </label>
          ))}
        </div>
      </div>
      <InputGroup className="scale-input-group">
        <span className="subTitle">Y1축 스케일: </span>
        <label>
          <span>최솟값</span>
          <input
            // placeholder="Min Value"
            type="number"
            onChange={e =>
              changeAxisScale("y1", "min", Math.round(e.target.value))
            }
            value={y1.min}
          />
        </label>
        <label>
          <span>최댓값</span>
          <input
            // placeholder="Max Value"
            type="number"
            onChange={e =>
              changeAxisScale("y1", "max", Math.round(e.target.value))
            }
            value={y1.max}
          />
        </label>
        <label>
          <span>간격</span>
          <input
            // placeholder="Step Size"
            type="number"
            onChange={e =>
              changeAxisScale("y1", "stepSize", Math.round(e.target.value))
            }
            value={y1.stepSize}
          />
        </label>
      </InputGroup>
      <InputGroup className="scale-input-group">
        <span className="subTitle">Y2축 스케일: </span>
        <label>
          <span>최솟값</span>
          <input
            // placeholder="Min Value"
            type="number"
            onChange={e =>
              changeAxisScale("y2", "min", Math.round(e.target.value))
            }
            value={y2.min}
          />
        </label>
        <label>
          <span>최댓값</span>
          <input
            // placeholder="Max Value"
            type="number"
            onChange={e =>
              changeAxisScale("y2", "max", Math.round(e.target.value))
            }
            value={y2.max}
          />
        </label>
        <label>
          <span>간격</span>
          <input
            // placeholder="Step Size"
            type="number"
            onChange={e =>
              changeAxisScale("y2", "stepSize", Math.round(e.target.value))
            }
            value={y2.stepSize}
          />
        </label>
      </InputGroup>
      <div className="variables-checkBox">
        <span className="title">막대 그래프: </span>
        <div className="variables">
          {variables.map((variable, idx) => (
            <label
              className={
                !lineChart.includes(idx) ? "variable" : "variable disabled"
              }
              key={variable}
            >
              <FormCheck
                disabled={lineChart.includes(idx)}
                checked={barChart.includes(idx)}
                onChange={() => changeChart("bar", idx, qualitativeVariableIdx)}
              />
              <span>{variable}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="variables-checkBox">
        <span className="title">꺾은선 그래프: </span>
        <div className="variables">
          {variables.map((variable, idx) => (
            <label
              className={
                !barChart.includes(idx) ? "variable" : "variable disabled"
              }
              key={variable}
            >
              <FormCheck
                disabled={barChart.includes(idx)}
                checked={lineChart.includes(idx)}
                onChange={() =>
                  changeChart("line", idx, qualitativeVariableIdx)
                }
              />
              <span>{variable}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="chart">
        {x.value > -1 &&
          y1.value.length + y2.value.length === variables.length - 1 && (
            <Bar
              style={{ height: "350px" }}
              data={{
                labels: data.slice(1).map(item => item[0]),
                datasets: createDataset(),
              }}
              options={createOption()}
            />
          )}
      </div>
    </div>
  );
}

export default MixChartAxisScaleEditor;
