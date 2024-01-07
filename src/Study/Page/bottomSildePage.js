import React from 'react';
import Slider from 'react-slick';
import { Bar } from 'react-chartjs-2';
import { useEffect } from 'react';
import { customAxios } from '../../Common/CustomAxios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

// 바 그래프 컴포넌트
const GraphCard = ({ title, content }) => {
  return (
    <div style={{ width: '450px'}}>
        <strong>{title}</strong>
        <Card style={{ width: '18rem', height: '12rem' }}>
          <Card.Body>
            <Card.Text>
              {content}
            </Card.Text>
          </Card.Body>
      </Card>
    </div>
  );
};



// 슬라이더 컴포넌트
const BottomSlidePage = () => {
  const [data, setData] = useState([]);

  const getData = () => {
    customAxios.get('/dataLiteracy/sequenceData/reply?classId=1&chapterId=1&sequenceId=1')
    .then((res) => {
      setData(res.data);
      window.location.reload();
    })
    .catch((err) => console.log(err));
  }
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // 한 번에 보여질 슬라이드 수
    slidesToScroll: 1, // 한 번에 스크롤될 슬라이드 수
  };
      

  return (
    <div style={{ margin: '1rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h4>공유된 데이터</h4>
        <Button variant="primary" onClick={getData}>불러오기</Button>
      </div>
      <Slider {...settings}>
        {data && data.map((item) => (
          <GraphCard title={item.title} content={item.content} />
        ))}
      </Slider>
    </div>
  );
};

export default BottomSlidePage;
