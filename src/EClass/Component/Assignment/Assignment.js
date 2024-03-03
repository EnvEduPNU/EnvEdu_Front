import { Badge, Stack } from "react-bootstrap";
import useEClassAssignmentStore from "../../store/eClassAssignmentStore";
import ActivityMappingHandler from "../../utils/ActivityMappingHandler";
import * as Styled from "./Styled";
import makePdf from "../../../DataLiteracy/utils/makePdf";
import { useGraphDataStore } from "../../../Study/store/graphStore";
import { useTabStore } from "../../../Study/store/tabStore";
import React from "react";

function Assignment() {
  const eClassDatas = useEClassAssignmentStore(
    state => state.eClassDatasForAssignment
  );
  const setData = useGraphDataStore(state => state.setData);
  const changeActivity = useGraphDataStore(state => state.changeActivity);
  const changeTab = useTabStore(state => state.changeTab);

  const activityMappingHandler = new ActivityMappingHandler();

  const onClick = async e => {
    e.preventDefault();
    await makePdf.viewWithPdf();
  };

  const onClickChartBtn = (data, pageIndex, activityIndex) => {
    setData(data.data);
    changeActivity(pageIndex, activityIndex);
    changeTab("graph");
    localStorage.setItem("data", JSON.stringify(data.data));
  };

  return (
    <Styled.Wrapper className="div_container">
      <TitlePage />
      {eClassDatas.map((page, pageIndex) => (
        <Styled.Paper className="div_paper" key={pageIndex}>
          {page.map((activityData, activityIndex) =>
            activityData["canShare"] ||
            activityData["canSubmit"] ||
            activityData["classroomSequenceType"] === "CHART" ? (
              <Styled.ActivityWrapper key={activityIndex}>
                <Styled.ActivityHeader>
                  {activityData["canSubmit"] && (
                    <Badge style={{ cursor: "pointer" }} bg="success">
                      제출하기
                    </Badge>
                  )}
                  {activityData["canShare"] && (
                    <Badge style={{ cursor: "pointer" }} bg="success">
                      공유하기
                    </Badge>
                  )}
                  {activityData["classroomSequenceType"] === "CHART" && (
                    <Badge
                      onClick={() =>
                        onClickChartBtn(
                          activityData.data,
                          pageIndex,
                          activityIndex
                        )
                      }
                      style={{ cursor: "pointer" }}
                      bg="success"
                    >
                      해당 데이터로 그래프 그리기
                    </Badge>
                  )}
                  {activityData["isMine"] && (
                    <Badge style={{ cursor: "pointer" }} bg="info">
                      그래프 그리기 완료
                    </Badge>
                  )}
                </Styled.ActivityHeader>
                <div>
                  {activityMappingHandler.convertForAssignment(
                    activityData,
                    pageIndex,
                    activityIndex
                  )}
                </div>
              </Styled.ActivityWrapper>
            ) : (
              <div key={activityIndex}>
                {activityMappingHandler.convertForAssignment(
                  activityData,
                  pageIndex,
                  activityIndex
                )}
              </div>
            )
          )}
        </Styled.Paper>
      ))}

      <button className="pdfBtn" onClick={onClick}>
        pdf로 보기
      </button>
    </Styled.Wrapper>
  );
}

const TitlePage = () => {
  const { title, description, gradeLabel, subjectLabel, dataTypeLabel } =
    useEClassAssignmentStore();
  return (
    <Styled.Paper className="div_paper">
      <Styled.Box>
        <Styled.Title>#REPORT {title} - 이재훈</Styled.Title>
      </Styled.Box>
      <Stack
        direction="horizontal"
        gap={2}
        style={{ justifyContent: "flex-end", padding: "10px 0" }}
      >
        <Badge bg="primary">{gradeLabel}</Badge>
        <Badge bg="info">{subjectLabel}</Badge>
        <Badge bg="dark">{dataTypeLabel}</Badge>
      </Stack>
      <Styled.Box>
        <div style={{ marginTop: "1rem" }}>
          {description.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
      </Styled.Box>
    </Styled.Paper>
  );
};

export default Assignment;
