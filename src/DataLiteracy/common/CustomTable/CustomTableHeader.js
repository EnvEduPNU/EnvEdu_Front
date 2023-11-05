import * as Styled from "./Styled";

import { ReactComponent as PencilIcon } from "../../image/Pencil.svg";
import Select from "../Select/Select";
import { useGraphDataStore } from "../../store/graphStroe";

function CustomTableHeader() {
  const data = useGraphDataStore(state => state.data);
  const onClickPencil = () => {};
  const headers = data[0];

  return (
    <Styled.Wrapper>
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
                  defaultValue={"Cateogorical"}
                  items={["Cateogorical", "Numeric", "Identifier"]}
                />
              </Styled.Box>
            </Styled.Header>
          </Styled.HeaderWrapper>
        </Styled.Column>
      ))}
    </Styled.Wrapper>
  );
}

export default CustomTableHeader;
