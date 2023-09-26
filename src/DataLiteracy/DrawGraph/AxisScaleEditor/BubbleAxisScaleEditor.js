import { FormCheck, InputGroup } from "react-bootstrap";
import { useBubbleAxisScaleEditorStore } from "../../store/drawGraphStore";
import BubbleChart from "../../common/CustomChart/BubbleChart";

function BubbleAxisScaleEditor({ data, qualitativeVariableIdx }) {
  const {
    axisScale: { x, y, r },
    changeAxisValue,
    changeAxisScale,
  } = useBubbleAxisScaleEditorStore();

  const variables = data[qualitativeVariableIdx];

  return (
    <div className="bubbleAxisScaleEditor axisScaleEditor">
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
        <div className="scale">
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
            <input
              min={0}
              max={1000}
              type="range"
              onChange={e => {
                changeAxisScale("x", "min", Math.round(e.target.value));
              }}
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
            <input
              min={0}
              max={1000}
              type="range"
              onChange={e => {
                changeAxisScale("x", "max", Math.round(e.target.value));
              }}
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
        </div>
      </InputGroup>
      <InputGroup className="scale-input-group">
        <span className="subTitle">Y축 스케일: </span>
        <div className="scale">
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
            <input
              min={0}
              max={1000}
              type="range"
              onChange={e => {
                changeAxisScale("y", "min", Math.round(e.target.value));
              }}
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
            <input
              min={0}
              max={1000}
              type="range"
              onChange={e => {
                changeAxisScale("y", "max", Math.round(e.target.value));
              }}
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
        </div>
      </InputGroup>

      <BubbleChart
        data={data}
        qualitativeVariableIdx={qualitativeVariableIdx}
      />
    </div>
  );
}

export default BubbleAxisScaleEditor;
