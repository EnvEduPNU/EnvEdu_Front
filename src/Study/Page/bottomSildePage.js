import React from 'react';
import Slider from 'react-slick';
import { Bar } from 'react-chartjs-2';

// 간단한 바 그래프 데이터 및 옵션
const graphData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [65, 59, 80, 81, 56, 55],
      borderWidth: 1,
    },
  ],
};

const graphOptions = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

// 바 그래프 컴포넌트
const GraphCard = () => {
  return (
    <div style={{ width: '450px'}}>
        <h4>학생 1</h4>
        <Bar data={graphData} options={graphOptions} style={{ width: '100%', height: '100%'}} />
    </div>
  );
};

// 슬라이더 컴포넌트
const BottomSlidePage = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // 한 번에 보여질 슬라이드 수
        slidesToScroll: 3, // 한 번에 스크롤될 슬라이드 수
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };
      

  return (
    <Slider {...settings}>
        <GraphCard />
        <GraphCard />
        <GraphCard />
        <GraphCard />
        <GraphCard />
        <GraphCard />
    </Slider>
  );
};

export default BottomSlidePage;
