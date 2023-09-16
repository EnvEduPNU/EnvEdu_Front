import { useState } from "react";
import { FormCheck, InputGroup } from "react-bootstrap";
import { Scatter } from "react-chartjs-2";

function ScatterAxisScaleEditor({ data, qualitativeVariableIdx }) {
  /* X축 관련 상태*/
  const [selectedX, setSelectedX] = useState([]);
  const [minXValue, setMinXValue] = useState(0);
  const [maxXValue, setMaxXValue] = useState(0);
  const [xStepSize, setXStepSize] = useState(0);

  /* Y축 관련 상태 */
  const [selectedY, setSelectedY] = useState([]);
  const [minYValue, setMinYValue] = useState(0);
  const [maxYValue, setMaxYValue] = useState(0);
  const [yStepSize, setYStepSize] = useState(0);

  const variables = data[qualitativeVariableIdx];

  const onChange = (selected, setSelected, idx) => {
    if (selected.includes(idx)) {
      setSelected(state => state.filter(s => s !== idx));
      return;
    }

    if (
      selected.includes(qualitativeVariableIdx) ||
      (idx == qualitativeVariableIdx && selected.length > 0)
    ) {
      alert("질적변인과 양적변인을 동시에 선택할 수 없습니다.");
      return;
    }

    setSelected(state => [...state, idx]);
  };

  const onChangeSelectedX = idx => {
    if (idx == qualitativeVariableIdx) {
      alert("만들 수 없는 그래프 유형입니다.");
      return;
    }
    onChange(selectedX, setSelectedX, idx);
  };

  const onChangeSelectedY = idx => {
    if (idx == qualitativeVariableIdx) {
      alert("만들 수 없는 그래프 유형입니다.");
      return;
    }
    onChange(selectedY, setSelectedY, idx);
  };

  const randomColor = (transparency = 0.5) =>
    `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    }, ${transparency})`;

  const createDataset = () => {
    return [
      {
        label: "산점도 그래프",
        data: data.slice(1).map(item => ({
          x: item[selectedX[0]],
          y: item[selectedY[0]],
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
          min: minXValue,
          max: maxXValue,
          ticks: {
            stepSize: xStepSize,
            autoSkip: false,
          },
        },
        y: {
          min: minYValue,
          max: maxYValue,
          ticks: {
            stepSize: yStepSize,
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
              className={
                !selectedY.includes(idx) ? "variable" : "variable disabled"
              }
              key={variable}
            >
              <FormCheck
                disabled={selectedY.includes(idx)}
                checked={selectedX.includes(idx)}
                onChange={() => onChangeSelectedX(idx)}
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
                !selectedX.includes(idx) ? "variable" : "variable disabled"
              }
              key={variable}
            >
              <FormCheck
                disabled={selectedX.includes(idx) ? true : false}
                checked={selectedY.includes(idx)}
                onChange={() => onChangeSelectedY(idx)}
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
            onChange={e => setMinXValue(Math.round(e.target.value))}
          />
        </label>
        <label>
          <span>최댓값</span>
          <input
            // placeholder="Max Value"
            type="number"
            onChange={e => setMaxXValue(Math.round(e.target.value))}
          />
        </label>
        <label>
          <span>간격</span>
          <input
            // placeholder="Step Size"
            type="number"
            onChange={e => setXStepSize(Math.round(e.target.value))}
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
            onChange={e => setMinYValue(Math.round(e.target.value))}
          />
        </label>
        <label>
          <span>최댓값</span>
          <input
            // placeholder="Max Value"
            type="number"
            onChange={e => setMaxYValue(Math.round(e.target.value))}
          />
        </label>
        <label>
          <span>간격</span>
          <input
            // placeholder="Step Size"
            type="number"
            onChange={e => setYStepSize(Math.round(e.target.value))}
          />
        </label>
      </InputGroup>

      <div className="chart">
        {selectedX.length > 0 && selectedY.length > 0 && (
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
