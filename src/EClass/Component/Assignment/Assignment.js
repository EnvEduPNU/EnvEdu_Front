import { Badge, Button, Stack } from "react-bootstrap";
import useEClassAssignmentStore from "../../store/eClassAssignmentStore";
import ActivityMappingHandler from "../../utils/ActivityMappingHandler";
import * as Styled from "./Styled";
import makePdf from "../../../DataLiteracy/utils/makePdf";

function Assignment() {
  const eClassDatas = useEClassAssignmentStore(
    state => state.eClassDatasForAssignment
  );

  const activityMappingHandler = new ActivityMappingHandler();

  const onClick = async e => {
    e.preventDefault();
    await makePdf.viewWithPdf();
  };
  return (
    <Styled.Wrapper className="div_container">
      <TitlePage />
      {eClassDatas.map((page, pageIndex) => (
        <Styled.Paper className="div_paper" key={pageIndex}>
          {page.map((activityData, activityIndex) =>
            activityData["canShare"] || activityData["canSubmit"] ? (
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
          {description.split("\n").map(line => (
            <>
              {line}
              <br />
            </>
          ))}
        </div>
      </Styled.Box>
    </Styled.Paper>
  );
};

export default Assignment;
