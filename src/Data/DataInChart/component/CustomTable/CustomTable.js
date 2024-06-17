import { useEffect, useState } from "react";
import { useGraphDataStore } from "../../store/graphStore";
import * as Styled from "./Styled";
import TutorialButton from "./TutorialButton";

// data-in-chart 페이지 테이블이 나오는 컴포넌트
function CustomTable(props) {
  const { data, variables, changeValue, changeVariableType } =
    useGraphDataStore();
  const [editableCell, setEditableCell] = useState(null);

  useEffect(() => {
    regexCategory(variables, data);
    console.log("랜더링된 데이터 : " + JSON.stringify(data, null, 2));
  }, [data]);

  useEffect(() => {
    console.log("테이블 저장 버튼 : " + props.tableSaveClick);
  }, [props]);

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

  const inputChangeCheck = (e, row, col) => {
    handleInputChange(e, row, col);
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

  // Numeric과 Categorical 자동 구분 메서드
  const regexCategory = (variablesRegex, data) => {
    let variablesChange = variablesRegex;
    let headerColumnTypes = [];

    console.log(
      "처음 들어온 variable: " + JSON.stringify(JSON.stringify(variablesChange))
    );

    Object.keys(data).forEach((col) => {
      let regexCheck;
      if (typeof data[col] === "object" && data[col] !== null) {
        Object.keys(data[col]).forEach((key) => {
          const numericPattern = /^(\d+\.?\d*|\.\d+)$/;

          regexCheck = numericPattern.test(data[col][key])
            ? "Numeric"
            : "Categorical";

          // console.log(" 컬럼 : " + data[col][key] + " 타입 : " + regexCheck);

          if (col > 0 && col < 2) {
            headerColumnTypes.push({
              column: key,
              type: regexCheck,
            });

            onChangeType(key, regexCheck);
          }
        });
      }
      // console.log("headerColumnTypes = " + JSON.stringify(headerColumnTypes));
    });

    // console.log(
    //   "나중 variable : " + JSON.stringify(JSON.stringify(variablesChange))
    // );
  };

  return (
    <Styled.Wrapper>
      {data?.length <= 0 ? (
        <Styled.Notice>
          <TutorialButton buttonName={"Tutorial 하러가기"} />
          왼쪽 폴더에서 그래프 작성에 필요한 데이터를 선택해 주세요.
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
                {/* ------------------------- 테이블 헤더------------------ */}
                <Styled.Header>
                  <Styled.Th $isNotEnd>
                    {/* 컬럼 이름 */}
                    <span>{header}</span>
                  </Styled.Th>
                </Styled.Header>
                {/* --------------------------------------------------------- */}
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
                      onChange={(e) => inputChangeCheck(e, row + 1, col)}
                      onBlur={() => setEditableCell(null)}
                      onKeyDown={(e) => onClickEnter(e)}
                    />
                  ) : (
                    <>
                      <Styled.InputDiv
                        onDoubleClick={() => onDoubleClickData(row + 1, col)}
                      >
                        {d[col]}
                      </Styled.InputDiv>
                    </>
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
