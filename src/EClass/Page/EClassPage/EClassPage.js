import { useState } from "react";
import * as Styled from "./Styled";
import PaperWithToolBar from "../../Component/PaperWithToolBar/PaperWithToolBar";
import Thumbnail from "../../Component/Thumbnail/Thumbnail";
import { useNavigate } from "react-router-dom";

const EClassPage = () => {
  const navigate = useNavigate();
  const [paperCnt, setPaperCnt] = useState(1);

  return (
    <Styled.Wrapper>
      <div style={{ maxWidth: "950px", width: "100%" }}>
        <Styled.Block style={{ width: "100%", margin: "0 0 20px 0" }}>
          <Styled.Title>E-class 생성</Styled.Title>
        </Styled.Block>
        <div style={{ display: "flex", gap: "20px" }}>
          <section>
            <Styled.Block>
              <Styled.Label>제목</Styled.Label>
              <Styled.InputWrapper>
                <Styled.Input />
              </Styled.InputWrapper>
            </Styled.Block>
            <div>
              {Array(paperCnt)
                .fill(1)
                .map((_, idx) => (
                  <Styled.PaperWrapper key={idx}>
                    <PaperWithToolBar />
                  </Styled.PaperWrapper>
                ))}
            </div>
          </section>
          {/* <Styled.MainSectionWrapper> */}
          <Styled.MainSection>
            <Styled.SubSection>
              <Styled.Label>설명</Styled.Label>
              <Styled.Textarea />
            </Styled.SubSection>
            <Styled.SubSection>
              <Styled.Label>썸네일</Styled.Label>
              <Thumbnail />
            </Styled.SubSection>
            <Styled.SubSection>
              <Styled.SaveButton>저장</Styled.SaveButton>
            </Styled.SubSection>
            <Styled.SubSection onClick={() => navigate(-1)}>
              <Styled.CancelButton>취소</Styled.CancelButton>
            </Styled.SubSection>

            <Styled.SubSection style={{ marginTop: "30px" }}>
              <Styled.SaveButton onClick={() => setPaperCnt(cnt => cnt + 1)}>
                + 페이지 추가
              </Styled.SaveButton>
            </Styled.SubSection>
          </Styled.MainSection>
          {/* </Styled.MainSectionWrapper> */}
        </div>
      </div>
    </Styled.Wrapper>
  );
};

export default EClassPage;
