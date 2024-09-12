import * as Styled from "./Styled";

import { useEffect } from "react";
import { useGraphDataStore } from "../../../store/graphStore";
import { useTabStore } from "../../../store/tabStore";
import { sampleDatas } from "../../../data/sampleDatas";

function Dataset({ setModalOpen, setDataCategory }) {
  const { setData, setTitle } = useGraphDataStore();
  const { tab, changeTab } = useTabStore();

  const onClickBtn = (key) => {
    setData(sampleDatas[key]);
    setTitle(key);
    localStorage.setItem("data", JSON.stringify(sampleDatas[key]));
    localStorage.setItem("title", JSON.stringify(key));
    console.log("ExpertDataSet localStorage에 저장 완료!");
    setModalOpen(false);
    setDataCategory("ExpertData");
  };

  return (
    <Styled.Wrapper>
      <Styled.Box key="header">
        <Styled.Number>순서</Styled.Number>
        <Styled.Data style={{ background: "#f9fafb" }}>
          Dataset Name
        </Styled.Data>
      </Styled.Box>

      {Object.keys(sampleDatas).map((key, idx) => (
        <Styled.Box key={key}>
          <Styled.Number>{idx + 1}</Styled.Number>
          <Styled.Data onClick={() => onClickBtn(key)}>{key}</Styled.Data>
        </Styled.Box>
      ))}
    </Styled.Wrapper>
  );
}

export default Dataset;