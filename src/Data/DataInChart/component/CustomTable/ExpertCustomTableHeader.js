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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "5px",
                  }}
                >
                  <button
                    style={{
                      display: "block",
                      marginRight: "0.5rem",
                      paddingLeft: "0.8rem",
                      paddingRight: "0.8rem",
                      borderRadius: "0.5rem", // rounded-lg
                      backgroundColor: "#e0e1e2",
                    }}
                  >
                    X
                  </button>
                  <button
                    style={{
                      display: "block",
                      marginLeft: "0.5rem",
                      paddingLeft: "0.8rem",
                      paddingRight: "0.8rem",
                      borderRadius: "0.5rem", // rounded-lg
                      backgroundColor: "#e0e1e2",
                    }}
                  >
                    Y
                  </button>
                </div>
              </Styled.Th>
            </Styled.TableHeader>
          </Styled.HeaderWrapper>
        </Styled.Column>
      ))}
    </Styled.TableHeaderWrapper>
  );
}

export default ExpertCustomTableHeader;
