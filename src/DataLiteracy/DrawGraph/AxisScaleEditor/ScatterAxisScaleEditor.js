import { FormCheck, InputGroup } from "react-bootstrap";
import { Scatter } from "react-chartjs-2";
import { useScatterAxisScaleEditorStore } from "../../store/drawGraphStore";
import ScatterChart from "../CustomChart/ScatterChart";

function ScatterAxisScaleEditor({ data, qualitativeVariableIdx }) {
  const {
    axisScale: { x, y },
    changeAxisValue,
    changeAxisScale,
  } = useScatterAxisScaleEditorStore();

  const variables = data[qualitativeVariableIdx];

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

      <ScatterChart
        data={data}
        qualitativeVariableIdx={qualitativeVariableIdx}
      />
    </div>
  );
}

export default ScatterAxisScaleEditor;
