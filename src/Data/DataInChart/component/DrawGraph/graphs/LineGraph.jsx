import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { useGraphDataStore } from '../../../store/graphStore';
import Dropdown from '../Dropdown';
import { Slider } from '@mui/material';

const backgroundColor = [
  'rgba(255, 69, 0, 0.6)', // 진한 오렌지-레드
  'rgba(30, 144, 255, 0.6)', // 진한 도저 블루
  'rgba(255, 215, 0, 0.6)', // 진한 골드
  'rgba(50, 205, 50, 0.6)', // 진한 라임 그린
  'rgba(186, 85, 211, 0.6)', // 진한 오키드 (보라)
  'rgba(255, 127, 80, 0.6)', // 진한 코럴
];

const borderColor = [
  'rgba(255, 0, 0, 1)', // 레드
  'rgba(0, 0, 255, 1)', // 블루
  'rgba(255, 165, 0, 1)', // 오렌지
  'rgba(34, 139, 34, 1)', // 포레스트 그린
  'rgba(147, 112, 219, 1)', // 미디엄 퍼플
  'rgba(255, 69, 0, 1)', // 오렌지-레드
];

function LineGraph() {
  const {
    data,
    variables,
    selectedYVariableIndexs,
    addSelectedYVariableIndexs,
    selctedXVariableIndex,
    selectXVariableIndex,
    graphIdx,
    title,
  } = useGraphDataStore();

  const [barDatas, setBarDatas] = useState({
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# TEST',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  const [barOptions, setBarOptions] = useState({
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
      // 값 범위 조절 문제
      // x: {
      //   min: 0, // X축의 최소값 설정
      //   max: 10, // X축의 최대값 설정
      // },
      // y: {
      //   min: 10,
      //   max: 50,
      // },
    },
  });

  // 값 범위 조절 문제(Y)
  const [yScaleValue, setYScaleValue] = useState([0, 100]);

  // 값 최대 최소 범위 조절 문제(Y)
  const [yScaleMinMaxValue, setYScaleMinMaxValue] = useState([0, 100]);

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
        if (isNegitive === false) break;
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

    setXScaleMinMaxValue([0, data.length - 2]);
    setXScaleValue([0, data.length - 2]);
  }, [graphIdx, selectedYVariableIndexs]);

  // 초기 데이터 세팅
  useEffect(() => {
    let findedYindex = -1;
    let findedXindex = -1;
    if (selectedYVariableIndexs.length === 0) {
      findedYindex = variables.findIndex(
        (variable) =>
          variable.isSelected === false && variable.type === 'Numeric',
      );
      if (findedYindex !== -1) {
        addSelectedYVariableIndexs(findedYindex);
      }
    }
    if (selctedXVariableIndex === -1) {
      findedXindex = variables.findIndex(
        (variable) =>
          variable.isSelected === false &&
          findedYindex !== variable.variableIndex,
      );

      if (findedXindex !== -1) {
        selectXVariableIndex(findedXindex);
      }
    }

    console.log(data);
    console.log(findedYindex, findedXindex);
  }, [data, graphIdx]);

  // 새로운 Dropdown을 추가하는 함수
  const addYDropdown = () => {
    const findedindex = variables.findIndex(
      (variable) =>
        variable.isSelected === false && variable.type === 'Numeric',
    );
    if (findedindex !== -1) {
      addSelectedYVariableIndexs(findedindex);
    } else alert('추가 할 데이터가 없습니다.');
  };

  // data와 selectedYVariables가 바뀔때마다 그래프 데이터를 업데이트
  useEffect(() => {
    const updatedBarDatas = {
      labels: data.slice(1).map((row) => row[selctedXVariableIndex]),
      datasets: selectedYVariableIndexs.map((selctedYIndex) => ({
        label: data[0][selctedYIndex],
        data: data.slice(1).map((row) => row[selctedYIndex]),
        borderWidth: 1,
        backgroundColor: backgroundColor[selctedYIndex],
        borderColor: borderColor[selctedYIndex],
      })),
    };

    setBarDatas(updatedBarDatas);
  }, [data, selectedYVariableIndexs, selctedXVariableIndex]);

  // 값 범위 조절 문제
  useEffect(() => {
    console.log(yScaleValue);
    setBarOptions((prev) => ({
      ...prev,
      scales: {
        // y: {
        //   beginAtZero: true,
        // },
        x: {
          min: xScaleValue[0], // X축의 최소값 설정
          max: xScaleValue[1], // X축의 최대값 설정
          offset: true, // 데이터를 라벨의 중앙으로 이동
        },
        y: {
          min: yScaleValue[0],
          max: yScaleValue[1],
          ticks: {
            font: {
              size: 20, // y축 단위 글꼴 크기
            },
          },
        },
      },
    }));
  }, [xScaleValue, yScaleValue]);

  const handleChangeYScaleValue = (event, newValue) => {
    setYScaleValue(newValue);
  };

  const handleChangeXScaleValue = (event, newValue) => {
    setXScaleValue(newValue);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          margin: '0 0 20px 200px', // 위아래 간격 추가

          color: '#333', // 텍스트 색상
          fontSize: '24px', // 제목 크기
          fontWeight: 'bold', // 글씨 두껍게
          borderRadius: '10px', // 모서리 둥글게
        }}
      >
        {title}
      </div>
      <div className="flex" style={{ width: '1425px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // 수직 정렬
            gap: '10px', // 드롭다운 간 간격
            marginTop: '20px',
          }}
        >
          {/* 기존 드롭다운들 표시 */}
          {selectedYVariableIndexs.map((variableIndex, index) => (
            <div
              key={variableIndex}
              style={{ width: '150px', textAlign: 'center' }}
            >
              <Dropdown type="y" selectedIndex={variableIndex} />
            </div>
          ))}

          {/* + 버튼 */}
          <button
            type="button"
            style={{
              width: '40px', // 작은 크기의 버튼
              height: '40px', // 정사각형 버튼
              backgroundColor: '#6b7280', // 차분한 중간 회색 (bg-gray-500)
              color: 'white', // 텍스트 흰색
              borderRadius: '50%', // 동그란 버튼
              border: 'none', // 기본 브라우저 스타일 제거
              outline: 'none', // 기본 포커스 스타일 제거
              cursor: 'pointer', // 마우스 포인터
              display: 'flex', // 플렉스 박스
              justifyContent: 'center', // 가로 정렬
              alignItems: 'center', // 세로 정렬
              fontSize: '20px', // 더 큰 텍스트 크기
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // 부드러운 그림자 효과
              transition: 'background-color 0.3s ease', // 배경색 변경 애니메이션
            }}
            onClick={addYDropdown}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#4b5563'; // hover:bg-gray-600
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#6b7280'; // 기본 색상으로 돌아감
            }}
          >
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
              width: '50px',
              height: '400px',
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
                  backgroundColor: '#fff', // thumb의 배경색
                  border: '2px solid #1976d2', // thumb의 테두리 색상
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#1976d2', // 슬라이더 트랙 색상
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#ddd', // 슬라이더 레일 색상
                },
                '& .MuiSlider-valueLabel': {
                  backgroundColor: '#1976d2', // value label 색상
                  color: '#fff',
                },
              }}
            />
          </div>
        </div>
        <div style={{ width: '1200px' }}>
          <Line data={barDatas} options={barOptions} />
        </div>
      </div>
      <div
        style={{ width: '1200px', textAlign: 'center', marginLeft: '200px' }}
      >
        <div
          style={{
            width: '400px',
            margin: '0 auto',
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
                backgroundColor: '#fff', // thumb의 배경색
                border: '2px solid #1976d2', // thumb의 테두리 색상
              },
              '& .MuiSlider-track': {
                backgroundColor: '#1976d2', // 슬라이더 트랙 색상
              },
              '& .MuiSlider-rail': {
                backgroundColor: '#ddd', // 슬라이더 레일 색상
              },
              '& .MuiSlider-valueLabel': {
                backgroundColor: '#1976d2', // value label 색상
                color: '#fff',
              },
            }}
          />
        </div>
      </div>
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

export default LineGraph;
