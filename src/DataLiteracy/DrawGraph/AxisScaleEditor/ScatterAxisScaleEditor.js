import { FormCheck, InputGroup } from "react-bootstrap";
import { Scatter } from "react-chartjs-2";
import { useScatterAxisScaleEditorStore } from "../../store/drawGraphStore";

function ScatterAxisScaleEditor({ data, qualitativeVariableIdx }) {
  const {
    axisScale: { x, y },
    changeAxisValue,
    changeAxisScale,
  } = useScatterAxisScaleEditorStore();

  const variables = data[qualitativeVariableIdx];

  const randomColor = (transparency = 0.5) =>
    `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    }, ${transparency})`;

  const createDataset = () => {
    return [
      {
        label: "산점도 그래프",
        data: data.slice(1).map(item => ({
          x: item[x.value],
          y: item[y.value],
          label: item[qualitativeVariableIdx],
        })),
        backgroundColor: randomColor(),
        borderColor: randomColor(),
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
    };
  };
  return (
    <div className="scatterAxisScaleEditor axisScaleEditor">
      <div className="variables-checkBox">
        <span className="title">X축: </span>
        <div className="variables">
          {variables.map((variable, idx) => (
            <label
              className={y.value !== idx ? "variable" : "variable disabled"}
              key={variable}
            >
              <FormCheck
                disabled={y.value === idx}
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
              className={x.value !== idx ? "variable" : "variable disabled"}
              key={variable}
            >
              <FormCheck
                disabled={x.value === idx ? true : false}
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
          />
        </label>
      </InputGroup>

      <div className="chart">
        {x.value > -1 && y.value > -1 && (
          <Scatter
            data={{ datasets: createDataset() }}
            options={createOptions()}
          />
        )}
      </div>
    </div>
  );
}

export default ScatterAxisScaleEditor;
