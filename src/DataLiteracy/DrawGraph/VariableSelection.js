import { useEffect, useState } from "react";
import "./DrawGraph.scss";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import { Button } from "react-bootstrap";
import { useNavigate, useRoutes } from "react-router-dom";

const data = [
  ["농업지대", "평균기온", "강수량", "일조시간"],
  ["태백고냉", 21.9, 181.9, 149.7],
  ["소백간산", 25.3, 675.6, 140],
  ["영남내륙산간", 24.6, 578.3, 137.8],
  ["중부내륙", 25.9, 505.3, 144.5],
  ["소백서부내륙", 26, 699.7, 138.6],
  ["노령동서내륙", 25.6, 570.2, 136.2],
  ["호남내륙", 25.6, 570.2, 136.2],
  ["영남내륙", 26, 477.5, 123.8],
  ["중서부평야", 25.7, 508.1, 157],
  ["남서해안", 25.6, 500.8, 104.9],
  ["남부해안", 25.2, 623.4, 113.6],
  ["동해안남부", 26.2, 235.6, 167.3],
];

function VariableSelection() {
  const navigate = useNavigate();
  const [selectedIdx, setSelectedIdx] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("dataLiteracy") !== null) {
      const dataLiteracyData = JSON.parse(localStorage.getItem("dataLiteracy"));
      setSelectedIdx(dataLiteracyData.drawGraph.selectedIdx);
    }
  }, []);

  const onChange = idx => {
    if (selectedIdx.includes(idx)) {
      setSelectedIdx(selectedIdx.filter(index => index !== idx));
      return;
    }
    setSelectedIdx([...selectedIdx, idx]);
  };

  const onClickButton = () => {
    if (selectedIdx.length == 0) {
      alert("변인을 선택해 주세요");
      return;
    }
    localStorage.setItem(
      "dataLiteracy",
      JSON.stringify({
        sampleData: data,
        drawGraph: {
          selectedIdx,
        },
      })
    );
    navigate("/dataLiteracy/drawGraph/2");
  };

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
                  checked={selectedIdx.includes(idx)}
                  onChange={() => onChange(idx)}
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
      <Button onClick={onClickButton}>다음</Button>
    </div>
  );
}

export default VariableSelection;
