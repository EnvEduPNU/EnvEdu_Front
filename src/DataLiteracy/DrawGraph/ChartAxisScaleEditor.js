import { data } from "../sampleData/sampleData";
import BarAxisScaleEditor from "./BarAxisScaleEditor";

function ChartAxisScaleEditor() {
  const localStorageData = JSON.parse(localStorage.getItem("drawGraph")) || {};

  const filterData = data.map(row => {
    return row.filter((_, index) =>
      localStorageData.selectedVariable?.includes(index)
    );
  });

  const qualitativeVariableIdx = 0;
  return (
    <div className="chartAxisScaleEditor">
      <table className="myData-list">
        <thead>
          <tr>
            {filterData[0].map((key, idx) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filterData.slice(1).map((d, idx) => (
            <tr key={idx}>
              {d.map(key => (
                <td key={key}>{key}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <BarAxisScaleEditor
        data={filterData}
        qualitativeVariableIdx={qualitativeVariableIdx}
      />
    </div>
  );
}

export default ChartAxisScaleEditor;
