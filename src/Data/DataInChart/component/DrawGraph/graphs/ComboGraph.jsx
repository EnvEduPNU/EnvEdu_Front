import { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js';
import { useGraphDataStore } from '../../../store/graphStore';
import Dropdown from '../Dropdown';
import ComboDropdown from '../ComboDropdown';
import { Slider } from '@mui/material';

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
    graphIdx,
    title,
  } = useGraphDataStore();

  const chartRef = useRef(null);
  const myChartRef = useRef(null);

  const [barDatas, setBarDatas] = useState({
    labels: [],
    datasets: [],
  });

  const [barOptions, setBarOptions] = useState({
    responsive: true,
    scales: {
      y1: {
        position: 'left',
        beginAtZero: true,
        // max: y1Max,
        title: {
          rotation: 0, // 제목 회전 각도 (0이면 수평)
          display: true,
          // text: y1Label, // Y1 축 제목
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
        // max: y2Max,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          // text: y2Label, // Y1 축 제목
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
  });

  // 값 범위 조절 문제(Y)
  const [yScaleValue, setYScaleValue] = useState([0, 100]);

  // 값 최대 최소 범위 조절 문제(Y)
  const [yScaleMinMaxValue, setYScaleMinMaxValue] = useState([0, 100]);

  // 값 범위 조절 문제(Y2)
  const [y2ScaleValue, setY2ScaleValue] = useState([0, 100]);

  // 값 최대 최소 범위 조절 문제(Y2)
  const [y2ScaleMinMaxValue, setY2ScaleMinMaxValue] = useState([0, 100]);

  // 값 범위 조절 문제(X)
  const [xScaleValue, setXScaleValue] = useState([0, 100]);

  // 값 최대 최소 범위 조절 문제(X)
  const [xScaleMinMaxValue, setXScaleMinMaxValue] = useState([0, 100]);

  useEffect(() => {
    // if (selectedYVariableIndexs.length === 3) setYScaleMinMaxValue([0, 1000]);
    let isPostive = false;
    let isNegitive = false;
    let maxValue = -Infinity;
    let minValue = Infinity;

    let is2Postive = false;
    let is2Negitive = false;
    let max2Value = -Infinity;
    let min2Value = Infinity;

    // 양수 인지 아닌지 판단
    for (let i = 0; i < selectedYVariableIndexs.length; i++) {
      const selctedYVariableIndex = selectedYVariableIndexs[i];
      for (let j = 1; j < data.length; j++) {
        if (data[j][selctedYVariableIndex] > 0) {
          isPostive = true;
        }
        maxValue = Math.max(maxValue, data[j][selctedYVariableIndex]);
        minValue = Math.min(minValue, data[j][selctedYVariableIndex]);
      }
    }

    // 음수 인지 아닌지 판단
    for (let i = 0; i < selectedYVariableIndexs.length; i++) {
      const selctedYVariableIndex = selectedYVariableIndexs[i];
      for (let j = 1; j < data.length; j++) {
        if (data[j][selctedYVariableIndex] < 0) {
          isNegitive = true;
          break;
        }
        if (isNegitive === true) break;
      }
    }

    if (isPostive && isNegitive) {
      // 양수, 음수 다 있을 때
      setYScaleMinMaxValue([
        minValue ===
        Math.ceil(
          minValue / Math.pow(10, minValue.toString().split('.')[0].length - 2),
        ) *
          Math.pow(10, minValue.toString().split('.')[0].length - 2)
          ? minValue - 1
          : Math.ceil(
              minValue /
                Math.pow(10, minValue.toString().split('.')[0].length - 2),
            ) * Math.pow(10, minValue.toString().split('.')[0].length - 2),
        maxValue ===
        Math.ceil(
          maxValue / Math.pow(10, maxValue.toString().split('.')[0].length - 1),
        ) *
          Math.pow(10, maxValue.toString().split('.')[0].length - 1)
          ? maxValue + 1
          : Math.ceil(
              maxValue /
                Math.pow(10, maxValue.toString().split('.')[0].length - 1),
            ) * Math.pow(10, maxValue.toString().split('.')[0].length - 1),
      ]);
      setYScaleValue([
        minValue ===
        Math.ceil(
          minValue / Math.pow(10, minValue.toString().split('.')[0].length - 2),
        ) *
          Math.pow(10, minValue.toString().split('.')[0].length - 2)
          ? minValue - 1
          : Math.ceil(
              minValue /
                Math.pow(10, minValue.toString().split('.')[0].length - 2),
            ) * Math.pow(10, minValue.toString().split('.')[0].length - 2),
        maxValue ===
        Math.ceil(
          maxValue / Math.pow(10, maxValue.toString().split('.')[0].length - 1),
        ) *
          Math.pow(10, maxValue.toString().split('.')[0].length - 1)
          ? maxValue + 1
          : Math.ceil(
              maxValue /
                Math.pow(10, maxValue.toString().split('.')[0].length - 1),
            ) * Math.pow(10, maxValue.toString().split('.')[0].length - 1),
      ]);
    } else if (isPostive) {
      // 양수만 있을 때
      setYScaleMinMaxValue([
        0,

        maxValue ===
        Math.ceil(
          maxValue / Math.pow(10, maxValue.toString().split('.')[0].length - 1),
        ) *
          Math.pow(10, maxValue.toString().split('.')[0].length - 1)
          ? maxValue + 1
          : Math.ceil(
              maxValue /
                Math.pow(10, maxValue.toString().split('.')[0].length - 1),
            ) * Math.pow(10, maxValue.toString().split('.')[0].length - 1),
      ]);
      setYScaleValue([
        0,
        maxValue ===
        Math.ceil(
          maxValue / Math.pow(10, maxValue.toString().split('.')[0].length - 1),
        ) *
          Math.pow(10, maxValue.toString().split('.')[0].length - 1)
          ? maxValue + 1
          : Math.ceil(
              maxValue /
                Math.pow(10, maxValue.toString().split('.')[0].length - 1),
            ) * Math.pow(10, maxValue.toString().split('.')[0].length - 1),
      ]);
    } else if (isNegitive) {
      // 음수만 있을 때
      setYScaleMinMaxValue([
        minValue ===
        Math.ceil(
          minValue / Math.pow(10, minValue.toString().split('.')[0].length - 2),
        ) *
          Math.pow(10, minValue.toString().split('.')[0].length - 2)
          ? minValue - 1
          : Math.ceil(
              minValue /
                Math.pow(10, minValue.toString().split('.')[0].length - 2),
            ) * Math.pow(10, minValue.toString().split('.')[0].length - 2),
        0,
      ]);
      setYScaleValue([
        minValue ===
        Math.ceil(
          minValue / Math.pow(10, minValue.toString().split('.')[0].length - 2),
        ) *
          Math.pow(10, minValue.toString().split('.')[0].length - 2)
          ? minValue - 1
          : Math.ceil(
              minValue /
                Math.pow(10, minValue.toString().split('.')[0].length - 2),
            ) * Math.pow(10, minValue.toString().split('.')[0].length - 2),

        0,
      ]);
    }

    // 양수 인지 아닌지 판단
    for (let i = 0; i < selectedMoreYVariableIndexs.length; i++) {
      const selctedY2VariableIndex = selectedMoreYVariableIndexs[i];
      for (let j = 1; j < data.length; j++) {
        if (data[j][selctedY2VariableIndex] > 0) {
          is2Postive = true;
        }
        max2Value = Math.max(max2Value, data[j][selctedY2VariableIndex]);
        min2Value = Math.min(min2Value, data[j][selctedY2VariableIndex]);
      }
    }

    // 음수 인지 아닌지 판단
    for (let i = 0; i < selectedMoreYVariableIndexs.length; i++) {
      const selctedY2VariableIndex = selectedMoreYVariableIndexs[i];
      for (let j = 1; j < data.length; j++) {
        if (data[j][selctedY2VariableIndex] < 0) {
          is2Negitive = true;
          break;
        }
        if (is2Negitive === true) break;
      }
    }

    if (is2Postive && is2Negitive) {
      // 양수, 음수 다 있을 때
      setY2ScaleMinMaxValue([
        min2Value ===
        Math.ceil(
          min2Value /
            Math.pow(10, min2Value.toString().split('.')[0].length - 2),
        ) *
          Math.pow(10, min2Value.toString().split('.')[0].length - 2)
          ? min2Value - 1
          : Math.ceil(
              min2Value /
                Math.pow(10, min2Value.toString().split('.')[0].length - 2),
            ) * Math.pow(10, min2Value.toString().split('.')[0].length - 2),
        max2Value ===
        Math.ceil(
          max2Value /
            Math.pow(10, max2Value.toString().split('.')[0].length - 1),
        ) *
          Math.pow(10, max2Value.toString().split('.')[0].length - 1)
          ? max2Value + 1
          : Math.ceil(
              max2Value /
                Math.pow(10, max2Value.toString().split('.')[0].length - 1),
            ) * Math.pow(10, max2Value.toString().split('.')[0].length - 1),
      ]);
      setY2ScaleValue([
        min2Value ===
        Math.ceil(
          min2Value /
            Math.pow(10, min2Value.toString().split('.')[0].length - 2),
        ) *
          Math.pow(10, min2Value.toString().split('.')[0].length - 2)
          ? min2Value - 1
          : Math.ceil(
              min2Value /
                Math.pow(10, min2Value.toString().split('.')[0].length - 2),
            ) * Math.pow(10, min2Value.toString().split('.')[0].length - 2),
        max2Value ===
        Math.ceil(
          max2Value /
            Math.pow(10, max2Value.toString().split('.')[0].length - 1),
        ) *
          Math.pow(10, max2Value.toString().split('.')[0].length - 1)
          ? max2Value + 1
          : Math.ceil(
              max2Value /
                Math.pow(10, max2Value.toString().split('.')[0].length - 1),
            ) * Math.pow(10, max2Value.toString().split('.')[0].length - 1),
      ]);
    } else if (isPostive) {
      // 양수만 있을 때
      setY2ScaleMinMaxValue([
        0,

        max2Value ===
        Math.ceil(
          max2Value /
            Math.pow(10, max2Value.toString().split('.')[0].length - 1),
        ) *
          Math.pow(10, max2Value.toString().split('.')[0].length - 1)
          ? max2Value + 1
          : Math.ceil(
              max2Value /
                Math.pow(10, max2Value.toString().split('.')[0].length - 1),
            ) * Math.pow(10, max2Value.toString().split('.')[0].length - 1),
      ]);
      setY2ScaleValue([
        0,
        max2Value ===
        Math.ceil(
          max2Value /
            Math.pow(10, max2Value.toString().split('.')[0].length - 1),
        ) *
          Math.pow(10, max2Value.toString().split('.')[0].length - 1)
          ? max2Value + 1
          : Math.ceil(
              max2Value /
                Math.pow(10, max2Value.toString().split('.')[0].length - 1),
            ) * Math.pow(10, max2Value.toString().split('.')[0].length - 1),
      ]);
    } else if (is2Negitive) {
      // 음수만 있을 때
      setY2ScaleMinMaxValue([
        min2Value ===
        Math.ceil(
          min2Value /
            Math.pow(10, min2Value.toString().split('.')[0].length - 2),
        ) *
          Math.pow(10, min2Value.toString().split('.')[0].length - 2)
          ? min2Value - 1
          : Math.ceil(
              min2Value /
                Math.pow(10, min2Value.toString().split('.')[0].length - 2),
            ) * Math.pow(10, min2Value.toString().split('.')[0].length - 2),
        0,
      ]);
      setY2ScaleValue([
        min2Value ===
        Math.ceil(
          min2Value /
            Math.pow(10, min2Value.toString().split('.')[0].length - 2),
        ) *
          Math.pow(10, min2Value.toString().split('.')[0].length - 2)
          ? min2Value - 1
          : Math.ceil(
              min2Value /
                Math.pow(10, min2Value.toString().split('.')[0].length - 2),
            ) * Math.pow(10, min2Value.toString().split('.')[0].length - 2),

        0,
      ]);
    }

    setXScaleMinMaxValue([0, data.length - 2]);
    setXScaleValue([0, data.length - 2]);
  }, [graphIdx, selectedYVariableIndexs, selectedMoreYVariableIndexs]);

  // 초기 데이터 세팅
  // useEffect(() => {
  //   if (!selectedYVariableIndexs.length) {
  //     const firstYIndex = variables.findIndex(
  //       (variable) => !variable.isSelected && variable.type === 'Numeric',
  //     );
  //     if (firstYIndex !== -1) addSelectedYVariableIndexs(firstYIndex);
  //   }

  //   if (!selectedMoreYVariableIndexs.length) {
  //     const firstMoreYIndex = variables.findIndex(
  //       (variable) => !variable.isMoreSelected && variable.type === 'Numeric',
  //     );
  //     if (firstMoreYIndex !== -1)
  //       addSelectedMoreYVariableIndexs(firstMoreYIndex);
  //   }

  //   if (selctedXVariableIndex === -1) {
  //     const firstXIndex = variables.findIndex(
  //       (variable) => !variable.isSelected,
  //     );
  //     if (firstXIndex !== -1) selectXVariableIndex(firstXIndex);
  //   }
  // }, [data, graphIdx]);

  // 초기 데이터 세팅
  useEffect(() => {
    let firstYIndex = -1;
    let firstMoreYIndex = -1;
    let findedXindex = -1;

    if (selectedYVariableIndexs.length === 0) {
      firstYIndex = variables.findIndex(
        (variable) =>
          variable.isSelected === false && variable.type === 'Numeric',
      );
      if (firstYIndex !== -1) {
        addSelectedYVariableIndexs(firstYIndex);
      }
    }

    if (!selectedMoreYVariableIndexs.length === 0) {
      const firstMoreYIndex = variables.findIndex(
        (variable) =>
          !variable.isMoreSelected &&
          variable.type === 'Numeric' &&
          firstYIndex !== variable.variableIndex,
      );
      if (firstMoreYIndex !== -1)
        addSelectedMoreYVariableIndexs(firstMoreYIndex);
    }

    if (selctedXVariableIndex === -1) {
      findedXindex = variables.findIndex(
        (variable) =>
          variable.isSelected === false &&
          firstYIndex !== variable.variableIndex &&
          firstMoreYIndex !== variable.variableIndex,
      );

      if (findedXindex !== -1) {
        selectXVariableIndex(findedXindex);
      }
    }

    console.log(data);
    console.log(firstYIndex, findedXindex);
  }, [data, graphIdx]);

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

    myChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: barDatas,

      options: barOptions,
    });

    return () => {
      if (myChartRef.current) myChartRef.current.destroy();
    };
  }, [barDatas, barOptions]);

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

  // 값 범위 조절 문제
  useEffect(() => {
    // Y1과 Y2 데이터의 대표 label text 가져오기
    const y1Label = data[0][selectedYVariableIndexs[0]]; // 첫 번째 Y1 변수의 label
    const y2Label = data[0][selectedMoreYVariableIndexs[0]]; // 첫 번째 Y2 변수의 label

    setBarOptions({
      responsive: true,
      scales: {
        x: {
          min: xScaleValue[0], // X축의 최소값 설정
          max: xScaleValue[1], // X축의 최대값 설정
        },
        y1: {
          position: 'left',
          beginAtZero: true,
          min: yScaleValue[0],
          max: yScaleValue[1],
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
          ticks: {
            font: {
              size: 20, // y축 단위 글꼴 크기
            },
          },
        },
        y2: {
          position: 'right',
          beginAtZero: true,
          min: y2ScaleValue[0],
          max: y2ScaleValue[1],
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
          ticks: {
            font: {
              size: 20, // y축 단위 글꼴 크기
            },
          },
        },
      },
    });
  }, [xScaleValue, yScaleValue, y2ScaleValue]);

  const handleChangeYScaleValue = (event, newValue) => {
    setYScaleValue(newValue);
  };

  const handleChangeY2ScaleValue = (event, newValue) => {
    setY2ScaleValue(newValue);
  };

  const handleChangeXScaleValue = (event, newValue) => {
    setXScaleValue(newValue);
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
    >
      <div
        style={{
          width: '800px',
          textAlign: 'center',
          margin: '0 0 20px 200px', // 위아래 간격 추가
          padding: '10px 20px', // 내부 여백 추가
          color: '#333', // 텍스트 색상
          fontSize: '24px', // 제목 크기
          fontWeight: 'bold', // 글씨 두껍게
          borderRadius: '10px', // 모서리 둥글게
        }}
      >
        {title}
      </div>
      <div style={{ display: 'flex', width: '1600px' }}>
        {/* Y축 Dropdown */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            marginTop: '20px',
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

        <div
          style={{
            display: 'flex',
            alignItems: 'center', // 세로 가운데 정렬
            justifyContent: 'center', // 가로 가운데 정렬
          }}
        >
          <div
            style={{
              padding: '20px', // 패딩 통합
              borderRadius: '20px', // 둥근 모서리
              textAlign: 'center', // 텍스트 가운데 정렬
              width: '70px', // 슬라이더 주변의 폭을 조정
            }}
          >
            <div>
              {/* 최대값 및 최소값 표시 */}
              <div
                style={{
                  marginBottom: '15px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#1976d2',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  lineHeight: '16px',
                }}
              >
                Max
                <span style={{}}>{yScaleValue[1]}</span>
              </div>
              <div
                style={{
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Slider
                  orientation="vertical"
                  valueLabelDisplay="auto"
                  value={yScaleValue}
                  min={yScaleMinMaxValue[0]}
                  max={yScaleMinMaxValue[1]}
                  onChange={handleChangeYScaleValue}
                  sx={{
                    color: '#1976d2', // 슬라이더의 트랙 및 thumb 색상
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#fff', // thumb 배경색
                      border: '2px solid #1976d2', // thumb 테두리 색상
                      width: '20px', // thumb 크기
                      height: '20px', // thumb 크기
                      '&:hover': {
                        boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)', // hover 시 그림자
                      },
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#1976d2', // 트랙 색상
                      width: '8px', // 트랙 너비 (세로 슬라이더에서 width로 설정)
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: '#ddd', // 레일 색상
                      width: '8px', // 레일 너비 (세로 슬라이더에서 width로 설정)
                    },
                    '& .MuiSlider-valueLabel': {
                      backgroundColor: '#1976d2', // value label 배경색
                      color: '#fff', // value label 텍스트 색상
                      fontSize: '14px', // value label 글자 크기
                    },
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: '15px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#1976d2',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  lineHeight: '16px',
                }}
              >
                Min
                <span>{yScaleValue[0]}</span>
              </div>
            </div>
          </div>
        </div>
        {/* 차트 */}
        <div style={{ minWidth: '800px' }}>
          <canvas ref={chartRef} id="myChart"></canvas>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center', // 세로 가운데 정렬
            justifyContent: 'center', // 가로 가운데 정렬
          }}
        >
          <div
            style={{
              padding: '20px', // 패딩 통합
              borderRadius: '20px', // 둥근 모서리
              textAlign: 'center', // 텍스트 가운데 정렬
              width: '70px', // 슬라이더 주변의 폭을 조정
            }}
          >
            <div>
              {/* 최대값 및 최소값 표시 */}
              <div
                style={{
                  marginBottom: '15px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#1976d2',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  lineHeight: '16px',
                }}
              >
                Max
                <span style={{}}>
                  {y2ScaleValue[1] === -Infinity
                    ? '선택 안됨'
                    : y2ScaleValue[1]}
                </span>
              </div>
              <div
                style={{
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Slider
                  orientation="vertical"
                  valueLabelDisplay="auto"
                  value={y2ScaleValue}
                  min={y2ScaleMinMaxValue[0]}
                  max={y2ScaleMinMaxValue[1]}
                  onChange={handleChangeY2ScaleValue}
                  sx={{
                    color: '#1976d2', // 슬라이더의 트랙 및 thumb 색상
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#fff', // thumb 배경색
                      border: '2px solid #1976d2', // thumb 테두리 색상
                      width: '20px', // thumb 크기
                      height: '20px', // thumb 크기
                      '&:hover': {
                        boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)', // hover 시 그림자
                      },
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#1976d2', // 트랙 색상
                      width: '8px', // 트랙 너비 (세로 슬라이더에서 width로 설정)
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: '#ddd', // 레일 색상
                      width: '8px', // 레일 너비 (세로 슬라이더에서 width로 설정)
                    },
                    '& .MuiSlider-valueLabel': {
                      backgroundColor: '#1976d2', // value label 배경색
                      color: '#fff', // value label 텍스트 색상
                      fontSize: '14px', // value label 글자 크기
                    },
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: '15px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#1976d2',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  lineHeight: '16px',
                }}
              >
                Min
                <span>{y2ScaleValue[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Y2축 Dropdown */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            marginTop: '20px',
          }}
        >
          {selectedMoreYVariableIndexs.map((variableIndex) => (
            <div
              key={variableIndex}
              style={{ minWidth: '150px', textAlign: 'center' }}
            >
              <ComboDropdown type="y" selectedIndex={variableIndex} />
            </div>
          ))}
          <button type="button" style={buttonStyle} onClick={addMoreYDropdown}>
            +
          </button>
        </div>
      </div>

      <div
        style={{
          minWidth: '700px',
          textAlign: 'center', // 텍스트 가운데 정렬
          width: '580px',
          marginLeft: '270px',
          padding: '10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#1976d2',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '15px',
              marginRight: '15px',
            }}
          >
            Min
            <span>
              {data?.[xScaleValue[0] + 1]?.[selctedXVariableIndex] ?? -1}
            </span>
          </div>
          <div
            style={{
              width: '400px',
            }}
          >
            <Slider
              valueLabelDisplay="auto"
              value={xScaleValue}
              min={xScaleMinMaxValue[0]}
              max={xScaleMinMaxValue[1]}
              onChange={handleChangeXScaleValue}
              sx={{
                color: '#1976d2', // 슬라이더의 트랙 및 thumb 색상
                '& .MuiSlider-thumb': {
                  backgroundColor: '#fff', // thumb 배경색
                  border: '2px solid #1976d2', // thumb 테두리 색상
                  width: '20px', // thumb 크기
                  height: '20px', // thumb 크기
                  '&:hover': {
                    boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)', // hover 시 그림자
                  },
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#1976d2', // 트랙 색상
                  height: '8px', // 트랙 높이
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#ddd', // 레일 색상
                  height: '8px', // 레일 높이
                },
                '& .MuiSlider-valueLabel': {
                  backgroundColor: '#1976d2', // value label 배경색
                  color: '#fff', // value label 텍스트 색상
                  fontSize: '14px', // value label 글자 크기
                },
              }}
            />
          </div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#1976d2',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '15px',
              marginRight: '15px',
            }}
          >
            Max
            <span>
              {data?.[xScaleValue[1] + 1]?.[selctedXVariableIndex] ?? -1}
            </span>
          </div>
        </div>
      </div>
      {/* X축 Dropdown */}
      <div
        style={{
          width: '1000px',
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
