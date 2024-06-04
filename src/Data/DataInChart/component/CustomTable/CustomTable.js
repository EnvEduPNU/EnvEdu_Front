import { useState } from "react";
import { useGraphDataStore } from "../../store/graphStore";
import { ReactComponent as PencilIcon } from "../../../../Study/image/Pencil.svg";
import * as Styled from "./Styled";
import Select from "../../../../DataLiteracy/common/Select/Select";

// data-in-chart 페이지 테이블이 나오는 컴포넌트
function CustomTable({ isChangeCategory = true }) {
  const { data, variables, changeValue, changeVariableType } =
    useGraphDataStore();
  const [editableCell, setEditableCell] = useState(null);

  const tableNumberData = data.map((d, idx) => {
    if (idx === 0) return "순서";
    return `${idx}`;
  });

  const headers = data[0];

  const onChangeType = (index, type) => {
    changeVariableType(index, type);
  };

  const onDoubleClickData = (row, col) => {
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
      {data?.length <= 0 ? (
        <Styled.Notice>
          왼쪽 슬라이드를 열어 그래프 작성에 필요한 데이터를 선택해 주세요.
        </Styled.Notice>
      ) : (
        <>
          {/* 첫 컬럼 #Rows 번호 */}
          <Styled.FirstColumn key={"starter"} $isNotEnd>
            <Styled.HeaderWrapper>
              <Styled.HeaderStartar>{tableNumberData[0]}</Styled.HeaderStartar>
            </Styled.HeaderWrapper>
            {tableNumberData.slice(1).map((d, idx) => (
              <Styled.RowNumber disabled key={idx}>
                {d}
              </Styled.RowNumber>
            ))}
          </Styled.FirstColumn>
          {/* 컬럼과 튜플들 */}
          {headers.map((header, col) => (
            <Styled.Column key={col} $isNotEnd={col !== headers.length - 1}>
              <Styled.HeaderWrapper>
                <Styled.Header>
                  <Styled.Th $isNotEnd>
                    {/* 컬럼 이름 */}
                    <span>{header}</span>
                    {/* <Styled.Circle onClick={onClickPencil}>
                      <PencilIcon width={"15px"} height={"15px"} />
                    </Styled.Circle> */}
                  </Styled.Th>
                  <Styled.Box>
                    {isChangeCategory ? (
                      <Select
                        defaultValue={variables[col].type}
                        items={["Categorical", "Numeric"]}
                        onChange={(type) => onChangeType(col, type)}
                      />
                    ) : (
                      variables[col].type
                    )}
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
                      onChange={(e) => handleInputChange(e, row + 1, col)}
                      onBlur={() => setEditableCell(null)}
                      onKeyDown={(e) => onClickEnter(e)}
                    />
                  ) : (
                    // 측정시간, 측정장소, 저장주기
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
        </>
      )}
    </Styled.Wrapper>
  );
}

export default CustomTable;
