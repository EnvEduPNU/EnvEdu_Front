import { useEffect } from "react";
import "./DrawGraph.scss";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import { useSelectedVariable } from "../store/drawGraphStore";
import { data } from "../sampleData/sampleData";

function VariableSelection() {
  // const [selectedIdx, setSelectedIdx] = useState([]);
  const { selectedVariable, changeSelectedVariable, setSelectedVariable } =
    useSelectedVariable();

  // useEffect(() => {
  //   if (localStorage.getItem("dataLiteracy") !== null) {
  //     const dataLiteracyData = JSON.parse(localStorage.getItem("dataLiteracy"));
  //     setSelectedVariable(dataLiteracyData.drawGraph.selectedIdx);
  //   }
  // }, []);

  return (
    <div>
      <table className="myData-list">
        <thead>
          <tr>
            {data[0].map((key, idx) => (
              <th key={key}>
                <span>{key}</span>
                <FormCheckInput
                  className="checkBox"
                  checked={selectedVariable?.includes(idx)}
                  onChange={() => changeSelectedVariable(idx)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d, idx) => {
            if (idx < 1) return;
            return (
              <tr key={idx}>
                {d.map(key => (
                  <td key={key}>{key}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default VariableSelection;
