import { useEffect, useState } from "react";
import { useGraphDataStore } from "../../store/graphStore";
import CustomBarChart from "../CustomChart/CustomBarChart";

import * as Styled from "./Styled";

function GraphAndEditor(props) {
  const graphIdx = useGraphDataStore((state) => state.graphIdx);
  const [pdfClick, setPdfClick] = useState(false);

  useEffect(() => {
    setPdfClick(props.pdfClick);
    console.log("GraphAndEditor pdf 클릭");
  }, [props]);

  return (
    <Styled.Wrapper>
      {graphIdx === 0 && (
        <>
          <CustomBarChart pdfClick={pdfClick} />
          {/* <BarEditor /> */}
        </>
      )}
      {/* {graphIdx === 1 && (
        <>
          <CustomLineChart />
          <LineEditor />
        </>
      )}
      {graphIdx === 2 && (
        <>
          <CustomBubbleChart />
          <BubbleEditor />
        </>
      )}
      {graphIdx === 3 && <></>}
      {graphIdx === 4 && (
        <>
          <CustomScatterChart />
          <ScatterEditor />
        </>
      )}
      {graphIdx === 5 && (
        <>
          <CustomMixChart />
          <MixEditor />
        </>
      )} */}
    </Styled.Wrapper>
  );
}

export default GraphAndEditor;
