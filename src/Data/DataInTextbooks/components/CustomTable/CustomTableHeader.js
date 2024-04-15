import * as Styled from "./Styled";

import { ReactComponent as PencilIcon } from "../../image/Pencil.svg";
import Select from "../Select/Select";
import { useGraphDataStore } from "../../store/graphStore";
import TutorialDescription from "../TutorialDescription/TutorialDescription";
import { usetutorialStroe } from "../../store/tutorialStore";
import { ustTabStore } from "../../store/tabStore";
import Portal from "../../../Portal";
import useComponentPosition from "../../hooks/useComponentPosition";
import Overlay from "../Overlay/Overlay";

function CustomTableHeader() {
  const { changeTab } = ustTabStore();
  const { ref, position } = useComponentPosition();
  const { isTutorial, step } = usetutorialStroe();
  const { data, variables, changeSelectedVariable, changeVariableType } =
    useGraphDataStore();
  const headers = data[0];

  const onClickPencil = () => {};

  const onChangeType = (index, type) => {
    changeVariableType(index, type);
  };
  const onClickShwoBotton = variableIdx => {
    changeSelectedVariable(variableIdx);
  };
  return (
    <Styled.TableHeaderWrapper ref={ref}>
      {headers.map((header, col) => (
        <Styled.Column key={col} $isNotEnd={col != headers.length - 1}>
          <Styled.HeaderWrapper>
            <Styled.TableHeader>
              <Styled.Th>
                <span>{header}</span>
                <Styled.Circle onClick={onClickPencil}>
                  <PencilIcon width={"15px"} height={"15px"} />
                </Styled.Circle>
              </Styled.Th>
              <Styled.Box $isNotEnd>
                <Select
                  defaultValue={variables[col].getType}
                  items={["Categorical", "Numeric"]}
                  onChange={type => onChangeType(col, type)}
                />
              </Styled.Box>
              <Styled.Box>
                <Styled.Button
                  onClick={() => onClickShwoBotton(col)}
                  $isSelected={variables[col].getIsSelected}
                >
                  선택
                </Styled.Button>
              </Styled.Box>
            </Styled.TableHeader>
          </Styled.HeaderWrapper>
        </Styled.Column>
      ))}
      {isTutorial && step == 2 && (
        <Portal>
          <TutorialDescription
            position="top"
            prevButtonClick={() => changeTab("graph")}
            top={position.top + 120}
            left={position.left + 300}
            width={400}
          />
          <Overlay position={position} />
        </Portal>
      )}
    </Styled.TableHeaderWrapper>
  );
}

export default CustomTableHeader;
