import * as Styled from "./Styled";
import { useGraphDataStore } from "../../store/graphStore";
import Select from "../../../../DataLiteracy/common/Select/Select";
import { ReactComponent as PencilIcon } from "../../../../Study/image/Pencil.svg";
import GraphSelector from "../GraphSelector/GraphSelector";
import ButtonSelector from "../../../../DataLiteracy/common/ButtonSelector/ButtonSelector";

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

  const AxisSelector = (props) => {
    const { variables, changeAxis } = useGraphDataStore();

    return (
      <Styled.Box>
        {/* <Styled.Title>축 선택</Styled.Title> */}
        <Styled.ButtonSelectorWrapper>
          {variables.map((variable, index) => {
            if (!variable.isSelected) return;
            if (index == props.col) {
              return (
                <ButtonSelector
                  key={index}
                  value={variable.name}
                  defaultValue={variable.axis}
                  selectList={["X", "Y"]}
                  onChange={(axis) => changeAxis(index, axis)}
                />
              );
            }
          })}
        </Styled.ButtonSelectorWrapper>
      </Styled.Box>
    );
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
                </Styled.Th>

                <Styled.Box>
                  <AxisSelector col={col} />
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
