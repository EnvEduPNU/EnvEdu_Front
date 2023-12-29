import { Bar } from "react-chartjs-2";
import useBarData from "../../../hooks/useBarData";
import * as Styled from "./Styled";
import { usetutorialStroe } from "../../../store/tutorialStore";
import useComponentPosition from "../../../hooks/useComponentPosition";
import Portal from "../../../../Portal";

function CustomBarChart() {
  const { labels, createDataset, createOptions, errorMessage, isError } =
    useBarData();

  const { isActiveGraph } = usetutorialStroe();
  const { ref, position } = useComponentPosition();

  return (
    <Styled.Wrapper ref={ref}>
      {isError ? (
        <Styled.ErrorMessage>{errorMessage}</Styled.ErrorMessage>
      ) : (
        <Styled.Graph>
          <Bar
            style={{ width: "100%", height: "100%" }}
            data={{
              labels,
              datasets: createDataset(),
            }}
            options={createOptions()}
          />
        </Styled.Graph>
      )}
      {isActiveGraph() && (
        <Portal>
          <Styled.Wrapper
            style={{
              position: "absolute",
              backgroundColor: "rgba(255,255,255)",
              zIndex: 1200,
              top: position.top,
              left: position.left,
              height: position.height,
              width: position.width,
              overflow: "hidden",
            }}
          >
            {isError ? (
              <Styled.ErrorMessage>{errorMessage}</Styled.ErrorMessage>
            ) : (
              <Styled.Graph>
                <Bar
                  style={{ width: "100%", height: "100%" }}
                  data={{
                    labels,
                    datasets: createDataset(),
                  }}
                  options={createOptions()}
                />
              </Styled.Graph>
            )}
          </Styled.Wrapper>
        </Portal>
      )}
    </Styled.Wrapper>
  );
}

export default CustomBarChart;
