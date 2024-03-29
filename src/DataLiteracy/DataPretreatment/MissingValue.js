import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { useDataPretreatmentStore } from "../store/dataPretreatmentStroe";
import classNames from "classnames";

function MissingValue() {
  const {
    data,
    isFindMissingValue,
    findMissingValue,
    changeMissingValue,
    imputedData,
    isImputed,
  } = useDataPretreatmentStore();

  const onSelect = eventKey => {
    changeMissingValue(eventKey);
  };

  return (
    <div className="missingValue">
      <div className="missingValueButtonWrapper">
        <Button onClick={findMissingValue}>결측치 찾기</Button>
        {isFindMissingValue && (
          <DropdownButton title="결측치 처리하기" onSelect={onSelect}>
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
        )}
      </div>
      <table className="table">
        <thead>
          <tr>
            {imputedData[0].map((key, idx) => (
              <th key={key + idx}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {imputedData.slice(1).map((d, row) => (
            <tr key={row}>
              {d.map((key, col) => (
                <td
                  className={classNames(
                    {
                      red:
                        isFindMissingValue && data.slice(1)[row][col] == null,
                    },
                    { green: isImputed && data.slice(1)[row][col] == null }
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

export default MissingValue;
