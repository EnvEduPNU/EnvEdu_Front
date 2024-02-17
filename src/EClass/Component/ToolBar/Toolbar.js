import { Button } from "react-bootstrap";
import * as Styled from "./Styled";
import H2 from "../H2/H2";
import H1 from "../H1/H1";
import Seed from "../Seed/Seed";
import Argument from "../Argument/Argument";
import ImageTool from "../ImageTool/ImageTool";
import YoutubeTool from "../YoutubeTool/YoutubeTool";
import Question from "../Question/Question";
import TableTool from "../TableTool/TableTool";
import GraphTool from "../GraphTool/GraphTool";
import SubmitButton from "../SubmitButton/SubmitButton";
import { useEClassStore } from "../../store/eClassStore";
import ClassroomType from "../../utils/classRoomType";

function Toolbar({ pageNum }) {
  const appendActivity = useEClassStore(state => state.appendActivity);
  const getActiveNextIndex = useEClassStore(state => state.getActiveNextIndex);
  const onClickBtn = (component, type) => {
    appendActivity(pageNum, component, type);
  };
  return (
    <Styled.Wrapper>
      <Styled.ToolGroup>
        <Styled.Tool
          onClick={() =>
            onClickBtn(
              <H1
                pageIndex={pageNum}
                dataIndex={getActiveNextIndex(pageNum)}
              />,
              ClassroomType.H2
            )
          }
        >
          H1
        </Styled.Tool>
        <Styled.Tool
          onClick={() =>
            onClickBtn(
              <H2
                pageIndex={pageNum}
                dataIndex={getActiveNextIndex(pageNum)}
              />,
              ClassroomType.H2
            )
          }
        >
          H2
        </Styled.Tool>
      </Styled.ToolGroup>
      <Styled.Bar></Styled.Bar>
      <Styled.ToolGroup>
        <Styled.Tool onClick={() => onClickBtn(<Seed />, ClassroomType.SEED)}>
          SEED
        </Styled.Tool>
        <Styled.Tool
          onClick={() => onClickBtn(<Argument />, ClassroomType.DISCUSS)}
        >
          토론
        </Styled.Tool>
        <Styled.Tool
          onClick={() => onClickBtn(<Question />, ClassroomType.QNA)}
        >
          질문
        </Styled.Tool>
      </Styled.ToolGroup>
      <Styled.Bar />
      <Styled.ToolGroup>
        <ImageTool pageNum={pageNum} />
        <YoutubeTool pageNum={pageNum} />
      </Styled.ToolGroup>
      <Styled.Bar />
      <Styled.ToolGroup>
        <TableTool pageNum={pageNum} />
        <GraphTool pageNum={pageNum} />
      </Styled.ToolGroup>
      <Styled.Bar />
      <Styled.ToolGroup>
        <Styled.Tool
          onClick={() => onClickBtn(<SubmitButton text={"제출하기"} />, null)}
        >
          제출
        </Styled.Tool>
        <Styled.Tool
          onClick={() => onClickBtn(<SubmitButton text={"공유하기"} />, null)}
        >
          공유
        </Styled.Tool>
      </Styled.ToolGroup>
    </Styled.Wrapper>
  );
}

export default Toolbar;
