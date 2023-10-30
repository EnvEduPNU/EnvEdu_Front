import { FormCheck, InputGroup } from "react-bootstrap";
import { useBarAxisSacleEditorStore } from "../../store/drawGraphStore";
import { useCallback, useRef } from "react";
import BarChart from "../../common/CustomChart/BarChart";
import MultiRangeSlider from "../../common/MultiRangeSlider/MultiRangeSlider";

function BarAxisScaleEditor({ data, qualitativeVariableIdx }) {
  const {
    axisScale: { x, y, min, max, stepSize },
    changeMinValue,
    changeMaxValue,
    changeStepSize,
    changeSelectedX,
    changeSelectedY,
  } = useBarAxisSacleEditorStore();

  const variables = data[qualitativeVariableIdx];

  return (
    <div className="barAxisScaleEditor axisScaleEditor">
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
            type="number"
            onChange={e => {
              changeMinValue(Math.round(e.target.value * 10) / 10);
            }}
            value={min}
          />
          <input
            min={0}
            max={1000}
            type="range"
            onChange={e => {
              changeMinValue(Math.round(e.target.value * 10) / 10);
            }}
            value={min}
          />
        </label>
        <label>
          <span>최댓값</span>
          <input
            // placeholder="Max Value"
            type="number"
            onChange={e => changeMaxValue(Math.round(e.target.value * 10) / 10)}
            value={max}
          />
          <input
            min={0}
            max={1000}
            type="range"
            onChange={e => {
              changeMaxValue(Math.round(e.target.value * 10) / 10);
            }}
            value={max}
          />
        </label>
        <label>
          <span>간격</span>
          <input
            // placeholder="Step Size"
            type="number"
            onChange={e => changeStepSize(Math.round(e.target.value * 10) / 10)}
            value={stepSize}
          />
        </label>
      </InputGroup>

      <BarChart data={data} qualitativeVariableIdx={qualitativeVariableIdx} />
    </div>
  );
}

export default BarAxisScaleEditor;
