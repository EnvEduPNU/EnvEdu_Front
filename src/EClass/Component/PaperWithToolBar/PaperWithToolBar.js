import { useState } from "react";
import Toolbar from "../ToolBar/Toolbar";
import * as Styled from "./Styled";

const PaperWithToolBar = () => {
  const [activities, setActivity] = useState([]);

  return (
    <Styled.Wrapper>
      <Toolbar setActivity={setActivity} />
      <Styled.Paper>
        {activities.map((a, idx) => (
          <div key={idx}>{a}</div>
        ))}
      </Styled.Paper>
    </Styled.Wrapper>
  );
};

export default PaperWithToolBar;
