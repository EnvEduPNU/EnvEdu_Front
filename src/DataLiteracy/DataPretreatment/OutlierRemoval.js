import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { useDataPretreatmentStore } from "../store/dataPretreatmentStroe";
import classNames from "classnames";

function OutlierRemoval() {
  const {
    isFindOutliers,
    dataWithoutOutliers,
    isRemoveOutliers,
    findOutliers,
    outliersIndices,
    changOutliers,
  } = useDataPretreatmentStore();

  const onSelect = eventKey => {
    // changeMissingValue(eventKey);
    findOutliers(eventKey);
  };
  console.log(outliersIndices);
  return (
    <div className="outlierRemoval">
      <div className="outlierRemovalButtonWrapper">
        <DropdownButton title="이상치 찾기" onSelect={onSelect}>
          <Dropdown.Item eventKey="z-score">Z-Score</Dropdown.Item>
          <Dropdown.Item eventKey="iqr">
            IQR (Interquartile Range)
          </Dropdown.Item>
          <Dropdown.Item eventKey="mad">
            MAD (Median Absolute Deviation)
          </Dropdown.Item>
        </DropdownButton>
        <DropdownButton
          title="이상치 처리하기"
          onSelect={eventKey => changOutliers(eventKey)}
        >
          <Dropdown.Item eventKey="mean">
            데이터셋의 평균 값을 사용하여 누락된 값을 대체
          </Dropdown.Item>
          <Dropdown.Item eventKey="median">
            데이터셋의 중앙값(median)을 사용하여 누락된 값을 대체
          </Dropdown.Item>
          <Dropdown.Item eventKey="mode">
            데이터셋의 최빈값(mode)을 사용하여 누락된 값을 대체
          </Dropdown.Item>
          <Dropdown.Item eventKey="linear">
            선형 보간법을 사용하여 누락된 값을 대체
          </Dropdown.Item>
        </DropdownButton>
      </div>
      <table className="table">
        <thead>
          <tr>
            {dataWithoutOutliers[0].map((key, idx) => (
              <th key={key + idx}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataWithoutOutliers.slice(1).map((d, row) => (
            <tr key={row}>
              {d.map((key, col) => (
                <td
                  className={classNames(
                    {
                      red:
                        isFindOutliers &&
                        outliersIndices.some(
                          subArray =>
                            JSON.stringify(subArray) ===
                            JSON.stringify([row + 1, col])
                        ),
                    },
                    {
                      green:
                        isRemoveOutliers &&
                        outliersIndices.some(
                          subArray =>
                            JSON.stringify(subArray) ===
                            JSON.stringify([row + 1, col])
                        ),
                    }
                  )}
                  key={key}
                >
                  {key}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OutlierRemoval;
