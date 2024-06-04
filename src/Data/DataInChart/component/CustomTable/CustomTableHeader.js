import * as Styled from "./Styled";
import { useGraphDataStore } from "../../store/graphStore";
import Select from "../../../../DataLiteracy/common/Select/Select";
import { ReactComponent as PencilIcon } from "../../../../Study/image/Pencil.svg";
import GraphSelector from "../GraphSelector/GraphSelector";

// Data&Chart 메뉴 Graph 탭의 테이블의 헤더 컴포넌트
function CustomTableHeader() {
  const { data, variables, changeSelectedVariable, changeVariableType } =
    useGraphDataStore();
  const headers = data[0];

  const onClickPencil = () => {};

  const onChangeType = (index, type) => {
    changeVariableType(index, type);
  };
  const onClickShwoBotton = (variableIdx) => {
    changeSelectedVariable(variableIdx);
  };
  return (
    <div>
      <GraphSelector />
      <Styled.TableHeaderWrapper>
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
                    defaultValue={variables[col].type}
                    items={["Categorical", "Numeric"]}
                    onChange={(type) => onChangeType(col, type)}
                  />
                </Styled.Box>
                <Styled.Box>
                  <Styled.Button
                    onClick={() => onClickShwoBotton(col)}
                    $isSelected={variables[col].isSelected}
                  >
                    선택
                  </Styled.Button>
                </Styled.Box>
              </Styled.TableHeader>
            </Styled.HeaderWrapper>
          </Styled.Column>
        ))}
      </Styled.TableHeaderWrapper>
    </div>
  );
}

export default CustomTableHeader;
