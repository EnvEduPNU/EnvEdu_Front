import "./DrawGraph.scss";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import { useSelectedVariable } from "../store/drawGraphStore";
import { data } from "../sampleData/sampleData";

function VariableSelection() {
  const { selectedVariable, changeSelectedVariable } = useSelectedVariable();

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
          {data.slice(1).map((d, idx) => (
            <tr key={idx}>
              {d.map(key => (
                <td key={key}>{key}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VariableSelection;
