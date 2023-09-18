import { FormCheck, InputGroup } from "react-bootstrap";
import { Bubble } from "react-chartjs-2";
import { useBubbleAxisScaleEditorStore } from "../../store/drawGraphStore";

function BubbleAxisScaleEditor({ data, qualitativeVariableIdx }) {
  const {
    axisScale: { x, y, r },
    changeAxisValue,
    changeAxisScale,
  } = useBubbleAxisScaleEditorStore();

  const variables = data[qualitativeVariableIdx];

  const randomColor = (transparency = 0.5) =>
    `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    }, ${transparency})`;

  function scaleBubbleSize(value, minValue, maxValue, minSize, maxSize) {
    return (
      ((value - minValue) / (maxValue - minValue)) * (maxSize - minSize) +
      minSize
    );
  }

  const createDataset = () => {
    const rData = data.slice(1).map(d => d[r.value]);
    const rDataMin = Math.min(...rData);
    const rDataMax = Math.max(...rData);
    return [
      {
        label: "버블 그래프",
        data: data.slice(1).map(item => ({
          x: item[x.value],
          y: item[y.value],
          r: scaleBubbleSize(item[r.value], rDataMin, rDataMax, 10, 30),
          label: item[qualitativeVariableIdx],
          rRealData: item[r.value],
        })),
        backgroundColor: randomColor(),
        borderWidth: 1,
      },
    ];
  };

  const createOptions = () => {
    return {
      scales: {
        x: {
          min: x.min,
          max: x.max,
          ticks: {
            stepSize: x.stepSize,
            autoSkip: false,
          },
        },
        y: {
          min: y.min,
          max: y.max,
          ticks: {
            stepSize: y.stepSize,
            autoSkip: false,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const point = context.dataset.data[context.dataIndex];
              const label = point.label;
              const xValue = context.parsed.x;
              const yValue = context.parsed.y;
              const rValue = point.rRealData;
              return `${label}: (${xValue}, ${yValue}, ${rValue})`;
            },
          },
        },
      },
    };
  };
  return (
    <div className="scatterAxisScaleEditor axisScaleEditor">
      <div className="variables-checkBox">
        <span className="title">X축: </span>
        <div className="variables">
          {variables.map((variable, idx) => (
            <label
              className={
                y.value !== idx && r.value !== idx
                  ? "variable"
                  : "variable disabled"
              }
              key={variable}
            >
              <FormCheck
                disabled={y.value === idx || r.value === idx}
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
        <span className="title">Y축: </span>
        <div className="variables">
          {variables.map((variable, idx) => (
            <label
              className={
                x.value !== idx && r.value !== idx
                  ? "variable"
                  : "variable disabled"
              }
              key={variable}
            >
              <FormCheck
                disabled={x.value === idx || r.value === idx ? true : false}
                checked={y.value === idx}
                onChange={() =>
                  changeAxisValue("y", idx, qualitativeVariableIdx)
                }
              />
              <span>{variable}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="variables-checkBox">
        <span className="title">버블: </span>
        <div className="variables">
          {variables.map((variable, idx) => (
            <label
              className={
                x.value !== idx && y.value !== idx
                  ? "variable"
                  : "variable disabled"
              }
              key={variable}
            >
              <FormCheck
                disabled={x.value === idx || y.value === idx ? true : false}
                checked={r.value === idx}
                onChange={() =>
                  changeAxisValue("r", idx, qualitativeVariableIdx)
                }
              />
              <span>{variable}</span>
            </label>
          ))}
        </div>
      </div>
      <InputGroup className="scale-input-group">
        <span className="subTitle">X축 스케일: </span>
        <label>
          <span>최솟값</span>
          <input
            // placeholder="Min Value"
            type="number"
            onChange={e =>
              changeAxisScale("x", "min", Math.round(e.target.value))
            }
            value={x.min}
          />
        </label>
        <label>
          <span>최댓값</span>
          <input
            // placeholder="Max Value"
            type="number"
            onChange={e =>
              changeAxisScale("x", "max", Math.round(e.target.value))
            }
            value={x.max}
          />
        </label>
        <label>
          <span>간격</span>
          <input
            // placeholder="Step Size"
            type="number"
            onChange={e =>
              changeAxisScale("x", "stepSize", Math.round(e.target.value))
            }
            value={x.stepSize}
          />
        </label>
      </InputGroup>
      <InputGroup className="scale-input-group">
        <span className="subTitle">Y축 스케일: </span>
        <label>
          <span>최솟값</span>
          <input
            // placeholder="Min Value"
            type="number"
            onChange={e =>
              changeAxisScale("y", "min", Math.round(e.target.value))
            }
            value={y.min}
          />
        </label>
        <label>
          <span>최댓값</span>
          <input
            // placeholder="Max Value"
            type="number"
            onChange={e =>
              changeAxisScale("y", "max", Math.round(e.target.value))
            }
            value={y.max}
          />
        </label>
        <label>
          <span>간격</span>
          <input
            // placeholder="Step Size"
            type="number"
            onChange={e =>
              changeAxisScale("y", "stepSize", Math.round(e.target.value))
            }
            value={y.stepSize}
          />
        </label>
      </InputGroup>

      <div className="chart" style={{ minWidth: "100%", minHeight: "100%" }}>
        {x.value > -1 && y.value > -1 && r.value > -1 && (
          <Bubble
            data={{ datasets: createDataset() }}
            options={createOptions()}
          />
        )}
      </div>
    </div>
  );
}

export default BubbleAxisScaleEditor;
