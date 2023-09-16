import { useState } from "react";
import { FormCheck, InputGroup } from "react-bootstrap";
import { Bar, Line } from "react-chartjs-2";

function LineAxisScaleEditor({ data, qualitativeVariableIdx }) {
  const [selectedX, setSelectedX] = useState([]);
  const [selectedY, setSelectedY] = useState([]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [stepSize, setStepSize] = useState(0);

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
    if (idx != qualitativeVariableIdx) {
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

  const datasets = () => {
    if (selectedX.includes(qualitativeVariableIdx)) {
      //x축에 질적 변인이 있다면 y축에 양적변인이 다 있음
      const yData = data[0].filter((label, idx) => selectedY.includes(idx));

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
          min: minValue,
          max: maxValue,
          ticks: {
            stepSize: stepSize,
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
        <label>
          <span>최솟값</span>
          <input
            // placeholder="Min Value"
            type="number"
            onChange={e => setMinValue(Math.round(e.target.value))}
          />
        </label>
        <label>
          <span>최댓값</span>
          <input
            // placeholder="Max Value"
            type="number"
            onChange={e => setMaxValue(Math.round(e.target.value))}
          />
        </label>
        <label>
          <span>간격</span>
          <input
            // placeholder="Step Size"
            type="number"
            onChange={e => setStepSize(Math.round(e.target.value))}
          />
        </label>
      </InputGroup>

      <div className="chart">
        {selectedX.length > 0 &&
          selectedY.length > 0 &&
          selectedX.includes(qualitativeVariableIdx) && (
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
