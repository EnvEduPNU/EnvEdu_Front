import { Bar } from 'react-chartjs-2';
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

function BarGraph() {
  const {
    data,
    variables,
    selectedYVariableIndexs,
    addSelectedYVariableIndexs,
    selctedXVariableIndex,
    selectXVariableIndex,
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

  // 값 범위 조절 문제
  // const [yScalseValue, setYScaleValue] = useState([0, 100]);

  // 초기 데이터 세팅
  useEffect(() => {
    if (selectedYVariableIndexs.length === 0) {
      const findedYindex = variables.findIndex(
        (variable) =>
          variable.isSelected === false && variable.type === 'Numeric',
      );
      if (findedYindex !== -1) {
        addSelectedYVariableIndexs(findedYindex);
      }
    }
    if (selctedXVariableIndex === -1) {
      const findedXindex = variables.findIndex(
        (variable) => variable.isSelected === false,
      );
      console.log(findedXindex);
      if (findedXindex !== -1) {
        selectXVariableIndex(findedXindex);
      }
    }
  }, [data]);

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
  // useEffect(() => {
  //   console.log(yScalseValue);
  //   setBarOptions((prev) => ({
  //     ...prev,
  //     scales: {
  //       // y: {
  //       //   beginAtZero: true,
  //       // },
  //       x: {
  //         min: 0, // X축의 최소값 설정
  //         max: 10, // X축의 최대값 설정
  //       },
  //       y: {
  //         min: yScalseValue[0],
  //         max: yScalseValue[1],
  //       },
  //     },
  //   }));
  // }, [yScalseValue]);

  // const handleChangeXScaleValue = (event, newValue) => {
  //   console.log(newValue);
  //   setYScaleValue(newValue);
  // };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="flex" style={{ width: '1400px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // 수직 정렬
            gap: '10px', // 드롭다운 간 간격
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
        {/* <div
          style={{
            width: '50px',
            display: 'flex',
            alignItems: 'center', // 세로 가운데 정렬
            justifyContent: 'center', // 가로 가운데 정렬 (필요한 경우)
          }}
        >
          Y축 범위 설정
          <Slider
            orientation="vertical"
            value={yScalseValue}
            onChange={handleChangeXScaleValue}
          />
        </div> */}
        <div style={{ width: '1200px' }}>
          <Bar data={barDatas} options={barOptions} />
        </div>
      </div>
      {/* <div
        style={{ width: '1200px', textAlign: 'center', marginLeft: '200px' }}
      >
        X축 범위 설정
      </div> */}
      <div
        style={{ width: '1400px', textAlign: 'right', marginBottom: '20px' }}
      >
        <Dropdown type="x" selectedIndex={selctedXVariableIndex} />
      </div>
    </div>
  );
}

export default BarGraph;
