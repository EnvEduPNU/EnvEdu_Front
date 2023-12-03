import * as Styled from "./Styled";
import { ReactComponent as PencilIcon } from "../../image/Pencil.svg";
import Select from "../Select/Select";
import { useGraphDataStore } from "../../store/graphStore";
import { useState } from "react";
import useComponentPosition from "../../hooks/useComponentPosition";
import { usetutorialStroe } from "../../store/tutorialStore";
import Portal from "../../../Portal";
import TutorialDescription from "../TutorialDescription/TutorialDescription";
import { ustTabStore } from "../../store/tabStore";

function CustomTable() {
  const { data, variables, changeValue, changeVariableType } =
    useGraphDataStore();
  const [editableCell, setEditableCell] = useState(null);
  const { ref, position } = useComponentPosition();
  const { changeTab } = ustTabStore();
  const { isTutorial, step } = usetutorialStroe();
  const tableNumberData = data.map((d, idx) => {
    if (idx == 0) return "Rows#";
    return `${idx}`;
  });

  const headers = data[0];

  const onClickPencil = () => {};

  const onChangeType = (index, type) => {
    changeVariableType(index, type);
  };

  const onDoubleClickData = (row, col) => {
    console.log(row, col);
    setEditableCell({ row, col });
  };

  const handleInputChange = (e, row, col) => {
    const newValue = e.target.value;
    changeValue(row, col, newValue);
  };

  const onClickEnter = ({ key, isComposing }) => {
    if (isComposing) {
      return;
    }

    if (key !== "Enter") {
      return;
    }

    setEditableCell(null);
  };

  return (
    <Styled.Wrapper>
      <Styled.FirstColumn key={"starter"} $isNotEnd ref={ref}>
        <Styled.HeaderWrapper>
          <Styled.HeaderStartar>{tableNumberData[0]}</Styled.HeaderStartar>
        </Styled.HeaderWrapper>
        {tableNumberData.slice(1).map((d, idx) => (
          <Styled.RowNumber disabled key={idx}>
            {d}
          </Styled.RowNumber>
        ))}
      </Styled.FirstColumn>
      {isTutorial && step === 5 && (
        <Portal>
          <TutorialDescription
            position="bottom"
            top={position.top - 240}
            left={position.left + 730}
            width={"500px"}
            prevButtonClick={() => {
              changeTab();
            }}
            nextButtonClick={() => {
              changeTab();
            }}
          />
        </Portal>
      )}
      {headers.map((header, col) => (
        <Styled.Column key={col} $isNotEnd={col != headers.length - 1}>
          <Styled.HeaderWrapper>
            <Styled.Header>
              <Styled.Th $isNotEnd>
                <span>{header}</span>
                <Styled.Circle onClick={onClickPencil}>
                  <PencilIcon width={"15px"} height={"15px"} />
                </Styled.Circle>
              </Styled.Th>
              <Styled.Box>
                <Select
                  defaultValue={variables[col].getType}
                  items={["Categorical", "Numeric"]}
                  onChange={type => onChangeType(col, type)}
                />
              </Styled.Box>
            </Styled.Header>
          </Styled.HeaderWrapper>
          {data.slice(1).map((d, row) => (
            <Styled.Data
              key={row}
              $isEditCell={
                editableCell &&
                editableCell.row === row + 1 &&
                editableCell.col === col
              }
            >
              {editableCell &&
              editableCell.row === row + 1 &&
              editableCell.col === col ? (
                <Styled.Input
                  value={d[col]}
                  spellCheck={false}
                  onChange={e => handleInputChange(e, row + 1, col)}
                  onBlur={() => setEditableCell(null)}
                  onKeyDown={e => onClickEnter(e)}
                />
              ) : (
                <Styled.InputDiv
                  onDoubleClick={() => onDoubleClickData(row + 1, col)}
                >
                  {d[col]}
                </Styled.InputDiv>
              )}
            </Styled.Data>
          ))}
        </Styled.Column>
      ))}
    </Styled.Wrapper>
  );
}

export default CustomTable;
