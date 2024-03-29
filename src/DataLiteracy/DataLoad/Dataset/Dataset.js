import { useNavigate } from "react-router-dom";
import { sampleDatas } from "../../sampleData/sampleData";
import { useGraphDataStore } from "../../store/graphStore";
import * as Styled from "./Styled";

function Dataset() {
  const { setData, setTitle } = useGraphDataStore();
  const navigate = useNavigate();

  const onClickBtn = key => {
    setData(sampleDatas[key]);
    setTitle(key);
    localStorage.setItem("data", JSON.stringify(sampleDatas[key]));
    localStorage.setItem("title", JSON.stringify(key));
    navigate("/dataLiteracy/drawGraph");
  };
  return (
    <Styled.Wrapper>
      <Styled.Box>
        <Styled.Number>Row#</Styled.Number>
        <Styled.Data style={{ background: "#f9fafb" }}>
          Dataset Name
        </Styled.Data>
      </Styled.Box>

      {Object.keys(sampleDatas).map((key, idx) => (
        <Styled.Box>
          <Styled.Number>{idx + 1}</Styled.Number>
          <Styled.Data onClick={() => onClickBtn(key)}>{key}</Styled.Data>
        </Styled.Box>
      ))}
    </Styled.Wrapper>
  );
}

export default Dataset;
