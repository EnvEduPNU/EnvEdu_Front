import { useState } from "react";
import Toolbar from "../ToolBar/Toolbar";
import * as Styled from "./Styled";
import H1 from "../H1/H1";
import H2 from "../H2/H2";
import Argument from "../Argument/Argument";
import Seed from "../Seed/Seed";

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
