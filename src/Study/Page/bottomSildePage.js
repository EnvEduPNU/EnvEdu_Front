import React from "react";
import Slider from "react-slick";
import { Bar } from "react-chartjs-2";
import { useEffect } from "react";
import { customAxios } from "../../Common/CustomAxios";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import useEClassAssignmentStore from "../../EClass/store/eClassAssignmentStore";
import { getEclassShareData } from "../../EClass/api/eclassApi";
import ActivityMappingHandler from "../../EClass/utils/ActivityMappingHandler";

// 바 그래프 컴포넌트
const GraphCard = ({ data }) => {
  const activityMappingHandler = new ActivityMappingHandler();
  return (
    <div style={{ width: "450px" }}>
      <strong>{data.username}</strong>
      <Card
        style={{
          width: "20rem",
          height: "12rem",
          overflowY: "auto",
          padding: "5px",
        }}
      >
        {activityMappingHandler.convertForSubmit(data)}
      </Card>
    </div>
  );
};

// 슬라이더 컴포넌트
const BottomSlidePage = () => {
  const { id, chapterId, eClassSequenceIds } = useEClassAssignmentStore();
  const [data, setData] = useState([]);

  const getData = sequenceId => {
    getEclassShareData(id, chapterId, sequenceId)
      .then(res => {
        setData(res.data);
        //window.location.reload();
      })
      .catch(err => console.log(err));
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // 한 번에 보여질 슬라이드 수
    slidesToScroll: 1, // 한 번에 스크롤될 슬라이드 수
  };

  return (
    <div style={{ margin: "1rem 2rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h4>공유된 데이터</h4>
        <div style={{ display: "flex", gap: "5px" }}>
          {eClassSequenceIds.map((sequenceId, idx) => (
            <Button
              key={sequenceId}
              variant="primary"
              style={{ width: "100px" }}
              onClick={() => getData(sequenceId)}
            >
              활동{idx + 1}
            </Button>
          ))}
        </div>
      </div>
      <Slider {...settings}>
        {data && data.map((item, key) => <GraphCard key={key} data={item} />)}
      </Slider>
    </div>
  );
};

export default BottomSlidePage;
