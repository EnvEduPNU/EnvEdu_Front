import * as Styled from "./Styled";
import { useGraphDataStore } from "../../store/graphStore";
import { useTabStore } from "../../store/tabStore";
import Overlay from "../../../../DataLiteracy/common/Overlay/Overlay";
import useComponentPosition from "../../../../DataLiteracy/hooks/useComponentPosition";
import Portal from "../../../../Portal";
import { usetutorialStroe } from "../../../../DataLiteracy/store/tutorialStore";
import TutorialDescription from "../../../../DataLiteracy/common/TutorialDescription/TutorialDescription";

function ExpertCustomTableHeader() {
  const { changeTab } = useTabStore();
  const { ref, position } = useComponentPosition();
  const { isTutorial, step } = usetutorialStroe();
  const { data } = useGraphDataStore();
  const headers = data[0];

  return (
    <Styled.TableHeaderWrapper ref={ref}>
      {headers.map((header, col) => (
        <Styled.Column key={col} $isNotEnd={col != headers.length - 1}>
          <Styled.HeaderWrapper>
            <Styled.TableHeader>
              <Styled.Th>
                <span>{header}</span>
                <div
                  className="mt-2"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <button
                    style={{
                      display: "block",
                      marginRight: "0.5rem",
                      paddingLeft: "15px",
                      paddingRight: "15px",
                      backgroundColor: "#e0e1e2",
                      borderRadius: "0.7rem",
                      fontSize: "14px",
                    }}
                  >
                    X
                  </button>
                  <button
                    style={{
                      display: "block",
                      marginLeft: "0.5rem",
                      paddingLeft: "15px",
                      paddingRight: "15px",
                      backgroundColor: "#e0e1e2",
                      borderRadius: "0.7rem",
                      fontSize: "14px",
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
      {isTutorial && step == 2 && (
        <Portal>
          <TutorialDescription
            position="top"
            prevButtonClick={() => changeTab("graph")}
            top={position.top + 120}
            left={position.left + 300}
            width={400}
          />
          <Overlay position={position} />
        </Portal>
      )}
    </Styled.TableHeaderWrapper>
  );
}

export default ExpertCustomTableHeader;
