import * as Styled from "./Styled";
import Select from "../Select/Select";
import { useGraphDataStore } from "../../store/graphStore";

import useComponentPosition from "../../hooks/useComponentPosition";

import { useTabStore } from "../../store/tabStore";

function ExpertCustomTableHeader() {
  const { ref, position } = useComponentPosition();

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
    <Styled.TableHeaderWrapper ref={ref}>
      {headers.map((header, col) => (
        <Styled.Column key={col} $isNotEnd={col != headers.length - 1}>
          <Styled.HeaderWrapper>
            <Styled.TableHeader>
              <Styled.Th>
                <span>{header}</span>
              </Styled.Th>
              <Styled.Box $isNotEnd>
                <Select
                  defaultValue={variables[col].getType}
                  items={["Categorical", "Numeric"]}
                  onChange={(type) => onChangeType(col, type)}
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
    </Styled.TableHeaderWrapper>
  );
}

export default ExpertCustomTableHeader;
