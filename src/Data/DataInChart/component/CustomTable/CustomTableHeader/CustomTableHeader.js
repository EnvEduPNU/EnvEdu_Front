import * as Styled from "./Styled";
import { useGraphDataStore } from "../../../store/graphStore";
import { categoricalStore } from "../../../store/categoricalStore";
import ButtonSelector from "../../ButtonSelector/ButtonSelector";
import { useEffect } from "react";

// Data&Chart 메뉴 Graph 탭의 테이블의 헤더 컴포넌트
function CustomTableHeader() {
  const { data, variables, changeAxis, changeGraph } = useGraphDataStore();

  const { changeCategory } = categoricalStore();

  const headers = data[0];

  useEffect(() => {
    console.log("랜더링 체크 로그 : " + data ? data : "");
  }, [data]);

  const AxisSelector = (props) => {
    return (
      <Styled.Box>
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
                  onChange={(axis) => {
                    changeAxis(index, axis);
                    const columnIndex = headers.indexOf(variable.name);
                    const secondValues = data
                      .slice(1)
                      .map((row) => row[columnIndex]);
                    changeCategory(secondValues);
                    console.log("바뀐 변인 이름 : " + secondValues);
                  }}
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
      {/*그래프 */}
      <Styled.TableHeaderWrapper>
        {headers?.map((header, col) => (
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
