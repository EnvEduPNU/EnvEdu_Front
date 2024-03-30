import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import useEClassAssignmentStore from "../../EClass/store/eClassAssignmentStore";
import {
  getEclassShareChartData,
  getEclassShareData,
  getEclassSubmitChartData,
  getEclassSubmitData,
} from "../../EClass/api/eclassApi";
import ActivityMappingHandler from "../../EClass/utils/ActivityMappingHandler";
import { ChartApiConverter } from "../../EClass/api/apiConverters";
import styled from "styled-components";

const activityMappingHandler = new ActivityMappingHandler();
const chartApiConverter = new ChartApiConverter();

// 바 그래프 컴포넌트
const GraphCard = ({ data }) => {
  return (
    <div>
      <strong>{data.username}</strong>
      {data.answerType === "CHART" ? (
        activityMappingHandler.convertForSubmit(data)
      ) : (
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
      )}
    </div>
  );
};

// 슬라이더 컴포넌트
const BottomSlidePage = () => {
  const { id, chapterId, eClassSequenceIds } = useEClassAssignmentStore();
  const [data, setData] = useState([]);
  const role = localStorage.getItem("role");

  const getShareChartData = async sequenceId => {
    const res = await getEclassShareChartData(id, chapterId, sequenceId);
    return Promise.all(
      res.data.map(item =>
        chartApiConverter.convertApiToSubmitAndShareData(item)
      )
    );
  };

  const getSubmitChartData = async sequenceId => {
    const res = await getEclassSubmitChartData(id, chapterId, sequenceId);
    return Promise.all(
      res.data.map(item =>
        chartApiConverter.convertApiToSubmitAndShareData(item)
      )
    );
  };

  const getData = async sequenceId => {
    if (role === "ROLE_EDUCATOR") {
      //선생은 학생이 제출한 데이터를 보게
      const chartData = await getSubmitChartData(sequenceId);
      getEclassSubmitData(id, chapterId, sequenceId)
        .then(res => {
          setData([...chartData, ...res.data]);
        })
        .catch(err => console.log(err));
    } else if (role === "ROLE_STUDENT") {
      //학생은 공유된 데이터만 보게
      const chartData = await getShareChartData(sequenceId);
      getEclassShareData(id, chapterId, sequenceId)
        .then(res => {
          setData([...chartData, ...res.data]);
        })
        .catch(err => console.log(err));
    }
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
        <h4>{role === "ROLE_EDUCATOR" ? "제출" : "공유"}된 데이터</h4>
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
      <CardWrapper>
        {data && data.map((item, key) => <GraphCard key={key} data={item} />)}
      </CardWrapper>
    </div>
  );
};

const CardWrapper = styled.div`
  margin-top: 5px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export default BottomSlidePage;
