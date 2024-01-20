import { useState } from "react";
import * as Styled from "./Styled";
import H1 from "../../Component/H1/H1";
import H2 from "../../Component/H2/H2";
import Seed from "../../Component/Seed/Seed";
import Argument from "../../Component/Argument/Argument";

const EClassPage = () => {
  const [activities, setActivity] = useState([
    [<H1 />, <H2 />, <Argument />, <H2 />, <Seed />, <H1 />, <H2 />],
  ]);

  return (
    <Styled.Wrapper>
      {activities.map((activity, idx) => (
        <Styled.Paper key={idx} className="div_paper">
          {activity.map((a, idx) => (
            <div key={idx}>{a}</div>
          ))}
        </Styled.Paper>
      ))}
    </Styled.Wrapper>
  );
};

export default EClassPage;
