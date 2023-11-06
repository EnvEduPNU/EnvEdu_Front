import * as Styled from "./Styled";

import { ReactComponent as PencilIcon } from "../../image/Pencil.svg";
import Select from "../Select/Select";
import { useGraphDataStore } from "../../store/graphStore";
import { Button } from "react-bootstrap";

function CustomTableHeader() {
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
    </Styled.TableHeaderWrapper>
  );
}

export default CustomTableHeader;
