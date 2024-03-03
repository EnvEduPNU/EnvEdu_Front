import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";
import ActivityMappingHandler from "../../EClass/utils/ActivityMappingHandler";
import useEClassAssignmentStore from "../../EClass/store/eClassAssignmentStore";
import { Badge } from "react-bootstrap";

export default function RightSlidePage() {
  const eClassDatas = useEClassAssignmentStore(state => state.eClassDatas);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const activityMappingHandler = new ActivityMappingHandler();

  return (
    <div
      style={{
        width: "600px",
        height: "100%",
        overflowY: "scroll",
        padding: "20px",
      }}
    >
      <h4>
        <Badge bg="success">E Class 전체 내용</Badge>
      </h4>
      <Slider {...settings}>
        {eClassDatas.map((page, pageIndex) => (
          <Paper key={pageIndex}>
            {page.map((activityData, activityIndex) => (
              <div style={{ padding: "5px" }} key={activityIndex}>
                {activityMappingHandler.convertForAssignment(
                  activityData,
                  pageIndex,
                  activityIndex
                )}
              </div>
            ))}
          </Paper>
        ))}
      </Slider>
    </div>
  );
}

const Paper = styled.div`
  height: 842px;
  width: 595px;
  background-color: white;
  /* text-align: center; */
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
