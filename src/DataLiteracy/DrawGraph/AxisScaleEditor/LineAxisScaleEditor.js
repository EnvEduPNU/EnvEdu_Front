import { FormCheck, InputGroup } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { useLineAxisSacleEditorStore } from "../../store/drawGraphStore";

function LineAxisScaleEditor({ data, qualitativeVariableIdx }) {
  const {
    axisScale: { x, y, min, max, stepSize },
    changeMinValue,
    changeMaxValue,
    changeStepSize,
    changeSelectedX,
    changeSelectedY,
  } = useLineAxisSacleEditorStore();

  const variables = data[qualitativeVariableIdx];

  const randomColor = (transparency = 0.5) =>
    `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    }, ${transparency})`;

  const datasets = () => {
    if (x.includes(qualitativeVariableIdx)) {
      //x축에 질적 변인이 있다면 y축에 양적변인이 다 있음
      const yData = data[0].filter((label, idx) => y.includes(idx));

      return yData.map((label, idx) => ({
        label,
        data: data.slice(1).map(item => item[idx + 1]),
        backgroundColor: randomColor(),
        borderWidth: 1,
      }));
    }
  };

  const createOptions = () => {
    return {
      scales: {
        y: {
          min,
          max,
          ticks: {
            stepSize,
            autoSkip: false,
          },
        },
      },
    };
  };

  return (
    <div className="lineAxisScaleEditor axisScaleEditor">
      <div className="variables-checkBox">
        <span className="title">X축: </span>
        <div className="variables">
          {variables.map((variable, idx) => (
            <label
              className={!y.includes(idx) ? "variable" : "variable disabled"}
              key={variable}
            >
              <FormCheck
                disabled={y.includes(idx)}
                checked={x.includes(idx)}
                onChange={() => changeSelectedX(idx, qualitativeVariableIdx)}
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
              className={!x.includes(idx) ? "variable" : "variable disabled"}
              key={variable}
            >
              <FormCheck
                disabled={x.includes(idx) ? true : false}
                checked={y.includes(idx)}
                onChange={() => changeSelectedY(idx, qualitativeVariableIdx)}
              />
              <span>{variable}</span>
            </label>
          ))}
        </div>
      </div>
      <InputGroup className="scale-input-group">
        <label>
          <span>최솟값</span>
          <input
            // placeholder="Min Value"
            type="number"
            value={min}
            onChange={e => changeMinValue(Math.round(e.target.value))}
          />
        </label>
        <label>
          <span>최댓값</span>
          <input
            // placeholder="Max Value"
            type="number"
            value={max}
            onChange={e => changeMaxValue(Math.round(e.target.value))}
          />
        </label>
        <label>
          <span>간격</span>
          <input
            // placeholder="Step Size"
            type="number"
            value={stepSize}
            onChange={e => changeStepSize(Math.round(e.target.value))}
          />
        </label>
      </InputGroup>

      <div className="chart">
        {x.length > 0 && y.length > 0 && x.includes(qualitativeVariableIdx) && (
          <Line
            data={{
              labels: data.slice(1).map(item => item[0]),
              datasets: datasets(),
            }}
            options={createOptions()}
          />
        )}
      </div>
    </div>
  );
}

export default LineAxisScaleEditor;
