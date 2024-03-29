import * as Styled from "./Styled";
import { ReactComponent as GraphIcon } from "../../image/GraphIcon.svg";
import { ReactComponent as TableIcon } from "../../image/TableIcon.svg";
import { ustTabStore } from "../../store/tabStore";
import { usetutorialStroe } from "../../store/tutorialStore";
import useComponentPosition from "../../hooks/useComponentPosition";
import Portal from "../../../Portal";
import TutorialDescription from "../TutorialDescription/TutorialDescription";
import Overlay from "../Overlay/Overlay";

function Tab() {
  const { tab, changeTab } = ustTabStore();
  const { step, isTutorial, type } = usetutorialStroe();
  const { ref, position } = useComponentPosition();
  const onClickTab = () => {
    changeTab();
  };
  return (
    <Styled.Wrapper>
      <Styled.Box onClick={onClickTab} $isSelect={tab === "table"} ref={ref}>
        <TableIcon />
        <span>Table</span>
        {isTutorial && step === 4 && type !== "mix" && (
          <Portal>
            <TutorialDescription
              position="top"
              top={position.top + 60}
              left={position.left - 90}
              nextButtonClick={() => {
                changeTab();
              }}
            />
            <Overlay position={position} />
          </Portal>
        )}
        {isTutorial && step === 5 && type === "mix" && (
          <Portal>
            <TutorialDescription
              position="top"
              top={position.top + 60}
              left={position.left - 90}
              nextButtonClick={() => {
                changeTab();
              }}
            />
            <Overlay position={position} />
          </Portal>
        )}
      </Styled.Box>
      <Styled.Box onClick={onClickTab} $isSelect={tab === "graph"}>
        <GraphIcon />
        <span>Graph</span>
      </Styled.Box>
    </Styled.Wrapper>
  );
}

export default Tab;
