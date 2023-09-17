import { useState } from "react";
import { FormCheck, InputGroup } from "react-bootstrap";
import { Bar } from "react-chartjs-2";

function MixChartAxisScaleEditor({ data, qualitativeVariableIdx }) {
  const [selectedX, setSelectedX] = useState(-1);

  const [selectedY1, setSelectedY1] = useState({
    selected: [],
    min: 0,
    max: 0,
    stepSize: 0,
  });
  const [selectedY2, setSelectedY2] = useState({
    selected: [],
    min: 0,
    max: 0,
    stepSize: 0,
  });

  const [selectedBar, setSelectedBar] = useState([]);
  const [selectedLine, setSelectedLine] = useState([]);

  const variables = data[qualitativeVariableIdx];

  const onChangeSelectedX = idx => {
    if (idx !== qualitativeVariableIdx) {
      alert("만들 수 없는 그래프 유형입니다.");
      return;
    }
    if (selectedX === idx) setSelectedX(-1);
    else setSelectedX(idx);
  };
  const onChangeY = (selected, setSelected, idx) => {
    if (idx === qualitativeVariableIdx) {
      alert("만들 수 없는 그래프 유형입니다.");
      return;
    }

    if (selected.selected.includes(idx)) {
      setSelected(state => ({
        ...state,
        selected: state.selected.filter(s => s !== idx),
      }));
      return;
    }

    setSelected(state => ({ ...state, selected: [...state.selected, idx] }));
  };
  const onChangeSelectedY1 = idx => {
    onChangeY(selectedY1, setSelectedY1, idx);
  };
  const onChangeSelectedY2 = idx => {
    onChangeY(selectedY2, setSelectedY2, idx);
  };

  const onChangeSelectedChart = (selected, setSelected, idx) => {
    if (selected.includes(idx)) {
      setSelected(state => state.filter(s => s !== idx));
      return;
    }

    if (idx === qualitativeVariableIdx) {
      alert("만들 수 없는 그래프 유형입니다.");
      return;
    }

    setSelected(state => [...state, idx]);
  };

  const onChangeSelectedBar = idx => {
    onChangeSelectedChart(selectedBar, setSelectedBar, idx);
  };

  const onChangeSelectedLine = idx => {
    onChangeSelectedChart(selectedLine, setSelectedLine, idx);
  };

  const randomColor = (transparency = 0.5) =>
    `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    }, ${transparency})`;

  const createDataset = () => {
    const datasets = data[0].slice(1).map((label, idx) => ({
      label,
      data: data.slice(1).map(item => item[idx + 1]),
      backgroundColor: randomColor(),
      borderWidth: 1,
    }));

    selectedY1.selected.forEach(y1 => {
      datasets[y1 - 1].yAxisID = "y1";
    });

    selectedY2.selected.forEach(y2 => {
      datasets[y2 - 1].yAxisID = "y2";
    });

    selectedLine.forEach(idx => {
      datasets[idx - 1].type = "line";
    });
    selectedBar.forEach(idx => {
      datasets[idx - 1].type = "bar";
    });

    return datasets;
  };

  const createOption = () => {
    return {
      scales: {
        y1: {
          position: "left",
          id: "y1",
          min: selectedY1.min,
          max: selectedY1.max,
          ticks: {
            stepSize: selectedY1.stepSize,
            autoSkip: false,
          },
        },
        y2: {
          position: "right",
          grid: {
            drawOnChartArea: false, // 오른쪽 y축의 그리드 라인을 숨김
          },
          display: true,
          min: selectedY2.min,
          max: selectedY2.max,
          ticks: {
            stepSize: selectedY2.stepSize,
            autoSkip: false,
          },
        },
      },
      // plugins: {
      //   legend: {
      //     position: "right", // 'top', 'left', 'bottom', 'right' 중 하나를 선택
      //   },
      //   tooltip: {
      //     position: "average", // 'average', 'nearest' 중 하나를 선택
      //     // 다른 툴팁 설정
      //   },
      // },
      responsive: true,
      maintainAspectRatio: false,
    };
  };

  return (
    <div className="mixChartAxisScaleEditor axisScaleEditor">
      <div className="variables-checkBox">
        <span className="title">X축: </span>
        <div className="variables">
          {variables.map((variable, idx) => (
            <label
              className={
                !selectedY1.selected.includes(idx) &&
                !selectedY2.selected.includes(idx)
                  ? "variable"
                  : "variable disabled"
              }
              key={variable}
            >
              <FormCheck
                disabled={
                  selectedY1.selected.includes(idx) ||
                  selectedY2.selected.includes(idx)
                }
                checked={selectedX === idx}
                onChange={() => onChangeSelectedX(idx)}
              />
              <span>{variable}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="variables-checkBox">
        <span className="title">Y1축: </span>
        <div className="variables">
          {variables.map((variable, idx) => (
            <label
              className={
                selectedX !== idx && !selectedY2.selected.includes(idx)
                  ? "variable"
                  : "variable disabled"
              }
              key={variable}
            >
              <FormCheck
                disabled={
                  selectedX === idx || selectedY2.selected.includes(idx)
                }
                checked={selectedY1.selected.includes(idx)}
                onChange={() => onChangeSelectedY1(idx)}
              />
              <span>{variable}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="variables-checkBox">
        <span className="title">Y2축: </span>
        <div className="variables">
          {variables.map((variable, idx) => (
            <label
              className={
                selectedX !== idx && !selectedY1.selected.includes(idx)
                  ? "variable"
                  : "variable disabled"
              }
              key={variable}
            >
              <FormCheck
                disabled={
                  selectedX === idx || selectedY1.selected.includes(idx)
                }
                checked={selectedY2.selected.includes(idx)}
                onChange={() => onChangeSelectedY2(idx)}
              />
              <span>{variable}</span>
            </label>
          ))}
        </div>
      </div>
      <InputGroup className="scale-input-group">
        <span className="subTitle">Y1축 스케일: </span>
        <label>
          <span>최솟값</span>
          <input
            // placeholder="Min Value"
            type="number"
            onChange={e =>
              setSelectedY1(state => ({
                ...state,
                min: Math.round(e.target.value),
              }))
            }
          />
        </label>
        <label>
          <span>최댓값</span>
          <input
            // placeholder="Max Value"
            type="number"
            onChange={e =>
              setSelectedY1(state => ({
                ...state,
                max: Math.round(e.target.value),
              }))
            }
          />
        </label>
        <label>
          <span>간격</span>
          <input
            // placeholder="Step Size"
            type="number"
            onChange={e =>
              setSelectedY1(state => ({
                ...state,
                stepSize: Math.round(e.target.value),
              }))
            }
          />
        </label>
      </InputGroup>
      <InputGroup className="scale-input-group">
        <span className="subTitle">Y2축 스케일: </span>
        <label>
          <span>최솟값</span>
          <input
            // placeholder="Min Value"
            type="number"
            onChange={e =>
              setSelectedY2(state => ({
                ...state,
                min: Math.round(e.target.value),
              }))
            }
          />
        </label>
        <label>
          <span>최댓값</span>
          <input
            // placeholder="Max Value"
            type="number"
            onChange={e =>
              setSelectedY2(state => ({
                ...state,
                max: Math.round(e.target.value),
              }))
            }
          />
        </label>
        <label>
          <span>간격</span>
          <input
            // placeholder="Step Size"
            type="number"
            onChange={e =>
              setSelectedY2(state => ({
                ...state,
                stepSize: Math.round(e.target.value),
              }))
            }
          />
        </label>
      </InputGroup>
      <div className="variables-checkBox">
        <span className="title">막대 그래프: </span>
        <div className="variables">
          {variables.map((variable, idx) => (
            <label
              className={
                !selectedLine.includes(idx) ? "variable" : "variable disabled"
              }
              key={variable}
            >
              <FormCheck
                disabled={selectedLine.includes(idx)}
                checked={selectedBar.includes(idx)}
                onChange={() => onChangeSelectedBar(idx)}
              />
              <span>{variable}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="variables-checkBox">
        <span className="title">꺾은선 그래프: </span>
        <div className="variables">
          {variables.map((variable, idx) => (
            <label
              className={
                !selectedBar.includes(idx) ? "variable" : "variable disabled"
              }
              key={variable}
            >
              <FormCheck
                disabled={selectedBar.includes(idx)}
                checked={selectedLine.includes(idx)}
                onChange={() => onChangeSelectedLine(idx)}
              />
              <span>{variable}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="chart">
        {selectedX > -1 &&
          selectedY1.selected.length + selectedY2.selected.length ===
            variables.length - 1 && (
            <Bar
              style={{ height: "400px" }}
              data={{
                labels: data.slice(1).map(item => item[0]),
                datasets: createDataset(),
              }}
              options={createOption()}
            />
          )}
      </div>
    </div>
  );
}

export default MixChartAxisScaleEditor;
