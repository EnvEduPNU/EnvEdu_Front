import { FormCheck, InputGroup } from "react-bootstrap";
import { useLineAxisSacleEditorStore } from "../../store/drawGraphStore";
import LineChart from "../../common/CustomChart/LineChart";

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
          <input
            min={0}
            max={1000}
            type="range"
            onChange={e => {
              changeMinValue(Math.round(e.target.value));
            }}
            value={min}
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
          <input
            min={0}
            max={1000}
            type="range"
            onChange={e => {
              changeMaxValue(Math.round(e.target.value));
            }}
            value={max}
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

      <LineChart data={data} qualitativeVariableIdx={qualitativeVariableIdx} />
    </div>
  );
}

export default LineAxisScaleEditor;
