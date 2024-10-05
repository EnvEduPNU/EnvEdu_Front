import { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js';
import { useGraphDataStore } from '../../../store/graphStore';
import Dropdown from '../Dropdown';
import ComboDropdown from '../ComboDropdown';

const backgroundColor = [
  'rgba(50, 205, 50, 0.6)', // 진한 라임 그린
  'rgba(255, 69, 0, 0.6)', // 진한 오렌지-레드
  'rgba(30, 144, 255, 0.6)', // 진한 도저 블루
  'rgba(255, 215, 0, 0.6)', // 진한 골드
  'rgba(186, 85, 211, 0.6)', // 진한 오키드 (보라)
  'rgba(255, 127, 80, 0.6)', // 진한 코럴
];
const borderColor = [
  'rgba(34, 139, 34, 1)', // 포레스트 그린
  'rgba(255, 0, 0, 1)', // 레드
  'rgba(0, 0, 255, 1)', // 블루
  'rgba(255, 165, 0, 1)', // 오렌지
  'rgba(147, 112, 219, 1)', // 미디엄 퍼플
  'rgba(255, 69, 0, 1)', // 오렌지-레드
];

const moreBackgroundColor = [
  'rgba(30, 144, 255, 0.6)', // 도저 블루
  'rgba(186, 85, 211, 0.6)', // 오키드
  'rgba(255, 182, 193, 0.6)', // 라이트 핑크
  'rgba(255, 99, 71, 0.6)', // 토마토
  'rgba(255, 215, 0, 0.6)', // 골드
  'rgba(60, 179, 113, 0.6)', // 미디엄 시아 그린
];

const moreBorderColor = [
  'rgba(100, 149, 237, 1)', // 칼리코 블루
  'rgba(75, 0, 130, 1)', // 인디고
  'rgba(255, 99, 71, 1)', // 토마토
  'rgba(255, 69, 0, 1)', // 진한 오렌지-레드
  'rgba(255, 140, 0, 1)', // 다크 오렌지
  'rgba(0, 128, 0, 1)', // 녹색
];

function ComboGraph() {
  const {
    data,
    variables,
    selectedYVariableIndexs,
    addSelectedYVariableIndexs,
    selectedMoreYVariableIndexs,
    addSelectedMoreYVariableIndexs,
    selctedXVariableIndex,
    selectXVariableIndex,
  } = useGraphDataStore();

  const chartRef = useRef(null);
  const myChartRef = useRef(null);

  const [barDatas, setBarDatas] = useState({
    labels: [],
    datasets: [],
  });

  // 초기 데이터 세팅
  useEffect(() => {
    if (!selectedYVariableIndexs.length) {
      const firstYIndex = variables.findIndex(
        (variable) => !variable.isSelected && variable.type === 'Numeric',
      );
      if (firstYIndex !== -1) addSelectedYVariableIndexs(firstYIndex);
    }

    if (!selectedMoreYVariableIndexs.length) {
      const firstMoreYIndex = variables.findIndex(
        (variable) => !variable.isMoreSelected && variable.type === 'Numeric',
      );
      if (firstMoreYIndex !== -1)
        addSelectedMoreYVariableIndexs(firstMoreYIndex);
    }

    if (selctedXVariableIndex === -1) {
      const firstXIndex = variables.findIndex(
        (variable) => !variable.isSelected,
      );
      if (firstXIndex !== -1) selectXVariableIndex(firstXIndex);
    }
  }, [data, variables]);

  // 차트 데이터 업데이트
  useEffect(() => {
    if (!data.length) return;

    const updatedBarDatas = {
      labels: data.slice(1).map((row) => row[selctedXVariableIndex]),
      datasets: [
        ...selectedYVariableIndexs.map((yIndex, i) => ({
          type: 'bar',
          label: data[0][yIndex],
          data: data.slice(1).map((row) => row[yIndex]),
          backgroundColor: backgroundColor[i % backgroundColor.length],
          borderColor: borderColor[i % borderColor.length],
          borderWidth: 1,
          yAxisID: 'y1',
        })),
        ...selectedMoreYVariableIndexs.map((yIndex, i) => ({
          type: 'line',
          label: data[0][yIndex],
          data: data.slice(1).map((row) => row[yIndex]),
          backgroundColor: moreBackgroundColor[i % moreBackgroundColor.length],
          borderColor: moreBorderColor[i % moreBorderColor.length],
          borderWidth: 1,
          yAxisID: 'y2',
        })),
      ],
    };

    setBarDatas(updatedBarDatas);
  }, [
    data,
    selectedYVariableIndexs,
    selectedMoreYVariableIndexs,
    selctedXVariableIndex,
  ]);

  // 차트 생성 및 업데이트
  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (myChartRef.current) myChartRef.current.destroy();

    const y1Data = barDatas.datasets
      .filter((ds) => ds.yAxisID === 'y1')
      .flatMap((ds) => ds.data);
    const y2Data = barDatas.datasets
      .filter((ds) => ds.yAxisID === 'y2')
      .flatMap((ds) => ds.data);

    const y1Max = Math.ceil(Math.max(...y1Data));
    const y2Max = Math.ceil(Math.max(...y2Data));

    // Y1과 Y2 데이터의 대표 label text 가져오기
    const y1Label = data[0][selectedYVariableIndexs[0]]; // 첫 번째 Y1 변수의 label
    const y2Label = data[0][selectedMoreYVariableIndexs[0]]; // 첫 번째 Y2 변수의 label

    myChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: barDatas,
      options: {
        responsive: true,
        scales: {
          y1: {
            position: 'left',
            beginAtZero: true,
            max: y1Max,
            title: {
              rotation: 0, // 제목 회전 각도 (0이면 수평)
              display: true,
              text: y1Label, // Y1 축 제목
              font: {
                size: 16, // 제목 글자 크기
                weight: '', // 제목 두께
                family: 'Arial', // 글꼴 패밀리
              },
              color: 'black', // 제목 색상
              padding: {
                top: 10, // 제목 위 여백
                bottom: 10, // 제목 아래 여백
              },
            },
          },
          y2: {
            position: 'right',
            beginAtZero: true,
            max: y2Max,
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: y2Label, // Y1 축 제목
              font: {
                size: 16, // 제목 글자 크기
                weight: '', // 제목 두께
                family: 'Arial', // 글꼴 패밀리
              },
              color: 'black', // 제목 색상
              padding: {
                top: 10, // 제목 위 여백
                bottom: 10, // 제목 아래 여백
              },
            },
          },
        },
      },
    });

    return () => {
      if (myChartRef.current) myChartRef.current.destroy();
    };
  }, [barDatas]);

  // 새로운 Y 변수 추가 함수
  const addYDropdown = () => {
    const availableIndex = variables.findIndex(
      (variable) => !variable.isSelected && variable.type === 'Numeric',
    );
    if (availableIndex !== -1) {
      addSelectedYVariableIndexs(availableIndex);
    } else {
      alert('추가할 데이터가 없습니다.');
    }
  };

  // 새로운 Y2 변수 추가 함수
  const addMoreYDropdown = () => {
    const availableIndex = variables.findIndex(
      (variable) => !variable.isMoreSelected && variable.type === 'Numeric',
    );
    if (availableIndex !== -1) {
      addSelectedMoreYVariableIndexs(availableIndex);
    } else {
      alert('추가할 데이터가 없습니다.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="flex" style={{ width: '1600px' }}>
        {/* Y축 Dropdown */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {selectedYVariableIndexs.map((variableIndex) => (
            <div
              key={variableIndex}
              style={{ width: '150px', textAlign: 'center' }}
            >
              <Dropdown type="y" selectedIndex={variableIndex} />
            </div>
          ))}
          <button type="button" style={buttonStyle} onClick={addYDropdown}>
            +
          </button>
        </div>

        {/* 차트 */}
        <div
          style={{ width: '1200px', marginLeft: '25px', marginRight: '25px' }}
        >
          <canvas ref={chartRef} id="myChart"></canvas>
        </div>

        {/* Y2축 Dropdown */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {selectedMoreYVariableIndexs.map((variableIndex) => (
            <div
              key={variableIndex}
              style={{ width: '150px', textAlign: 'center' }}
            >
              <ComboDropdown type="y" selectedIndex={variableIndex} />
            </div>
          ))}
          <button type="button" style={buttonStyle} onClick={addMoreYDropdown}>
            +
          </button>
        </div>
      </div>

      {/* X축 Dropdown */}
      <div
        style={{
          width: '1375px',
          textAlign: 'right',
          marginBottom: '20px',
          marginTop: '10px',
        }}
      >
        <Dropdown type="x" selectedIndex={selctedXVariableIndex} />
      </div>
    </div>
  );
}

const buttonStyle = {
  width: '40px',
  height: '40px',
  backgroundColor: '#6b7280',
  color: 'white',
  borderRadius: '50%',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '20px',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
};

export default ComboGraph;
