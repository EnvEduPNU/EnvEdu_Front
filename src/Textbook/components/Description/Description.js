import { Button } from "react-bootstrap";
import * as Styled from "./Styled";
import { useNavigate } from "react-router-dom";
import { useGraphDataStore } from "../../../Study/store/graphStore";

function Description({ title, description, data }) {
  const navigate = useNavigate();
  const setData = useGraphDataStore(state => state.setData);
  const onClickBtn = () => {
    localStorage.setItem("data", JSON.stringify(data));
    setData(data);
    navigate("/E-Classes/new");
  };
  return (
    <Styled.Wrapper>
      <Styled.Title>{title}</Styled.Title>
      <Styled.SubTitle>{description}</Styled.SubTitle>
      <Button onClick={onClickBtn}>해당 데이터로 E Class 만들기</Button>
    </Styled.Wrapper>
  );
}

export default Description;
