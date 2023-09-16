import { useState } from "react";
import { FormCheck, InputGroup } from "react-bootstrap";
import { Bubble } from "react-chartjs-2";

function BubbleAxisScaleEditor({ data, qualitativeVariableIdx }) {
  /* X축 관련 상태*/
  const [selectedX, setSelectedX] = useState(-1);
  const [minXValue, setMinXValue] = useState(0);
  const [maxXValue, setMaxXValue] = useState(0);
  const [xStepSize, setXStepSize] = useState(0);

  /* Y축 관련 상태 */
  const [selectedY, setSelectedY] = useState(-1);
  const [minYValue, setMinYValue] = useState(0);
  const [maxYValue, setMaxYValue] = useState(0);
  const [yStepSize, setYStepSize] = useState(0);

  /* 원 반지름 관련 상태 */
  const [selectedR, setSelectedR] = useState(-1);
  // const [minRValue, setMinRValue] = useState(0);
  // const [maxRValue, setMaxRValue] = useState(0);

  const variables = data[qualitativeVariableIdx];

  const onChange = (setSelected, idx) => {
    if (idx == qualitativeVariableIdx) {
      alert("만들 수 없는 그래프 유형입니다.");
      return;
    }
    setSelected(idx);
  };

  const onChangeSelectedX = idx => {
    onChange(setSelectedX, idx);
  };

  const onChangeSelectedY = idx => {
    onChange(setSelectedY, idx);
  };

  const onChangeSelectedR = idx => {
    onChange(setSelectedR, idx);
  };

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
    const rData = data.slice(1).map(d => d[selectedR]);
    const rDataMin = Math.min(...rData);
    const rDataMax = Math.max(...rData);
    return [
      {
        label: "버블 그래프",
        data: data.slice(1).map(item => ({
          x: item[selectedX],
          y: item[selectedY],
          r: scaleBubbleSize(item[selectedR], rDataMin, rDataMax, 10, 30),
          label: item[qualitativeVariableIdx],
          rRealData: item[selectedR],
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
                selectedY !== idx && selectedR !== idx
                  ? "variable"
                  : "variable disabled"
              }
              key={variable}
            >
              <FormCheck
                disabled={selectedY === idx || selectedR === idx}
                checked={selectedX === idx}
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
                selectedX !== idx && selectedR !== idx
                  ? "variable"
                  : "variable disabled"
              }
              key={variable}
            >
              <FormCheck
                disabled={selectedX === idx || selectedR === idx ? true : false}
                checked={selectedY === idx}
                onChange={() => onChangeSelectedY(idx)}
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
                selectedX !== idx && selectedY !== idx
                  ? "variable"
                  : "variable disabled"
              }
              key={variable}
            >
              <FormCheck
                disabled={selectedX === idx || selectedY === idx ? true : false}
                checked={selectedR === idx}
                onChange={() => onChangeSelectedR(idx)}
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

      <div className="chart" style={{ minWidth: "100%", minHeight: "100%" }}>
        {selectedX > -1 && selectedY > -1 && selectedR > -1 && (
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
