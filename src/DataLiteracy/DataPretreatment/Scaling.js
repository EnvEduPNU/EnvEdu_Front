import { Dropdown, DropdownButton } from "react-bootstrap";
import { useDataPretreatmentStore } from "../store/dataPretreatmentStroe";
import classNames from "classnames";

function Scaling() {
  const { resultData, changeByScaling } = useDataPretreatmentStore();

  return (
    <div className="scaling">
      <div className="missingValueButtonWrapper">
        <DropdownButton
          title="스케일링"
          onSelect={eventKey => changeByScaling(eventKey)}
        >
          <Dropdown.Item eventKey="minmax">
            최소-최대 스케일링 (Min-Max Scaling)
          </Dropdown.Item>
          <Dropdown.Item eventKey="zscore">
            표준화 (Z-Score Normalization)
          </Dropdown.Item>
          <Dropdown.Item eventKey="log">
            로그 변환 (Log Transform)
          </Dropdown.Item>
          <Dropdown.Item eventKey="sqrt">
            제곱근 변환 (Square Root Transform)
          </Dropdown.Item>
        </DropdownButton>
      </div>
      <table className="table">
        <thead>
          <tr>
            {resultData[0].map((key, idx) => (
              <th key={key + idx}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resultData.slice(1).map((d, row) => (
            <tr key={d + "" + row}>
              {d.map((key, col) => (
                <td
                  className={classNames({
                    // green: isImputed && data.slice(1)[row][col] == null,
                  })}
                  key={key + "" + col}
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

export default Scaling;
