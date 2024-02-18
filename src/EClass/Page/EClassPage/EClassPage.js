import * as Styled from "./Styled";
import PaperWithToolBar from "../../Component/PaperWithToolBar/PaperWithToolBar";
import Thumbnail from "../../Component/Thumbnail/Thumbnail";
import { useNavigate } from "react-router-dom";
import { useEClassStore } from "../../store/eClassStore";
import Dropdown from "react-multilevel-dropdown";

const gradeObj = {
  초등학생: ["1학년", "2학년", "3학년", "4학년", "5학년", "6학년", "공통"],
  중학생: ["1학년", "2학년", "3학년", "공통"],
  고등학생: ["1학년", "2학년", "3학년", "공통"],
};

const subjectObj = {
  사회: [],
  과학: [
    "통합과학1",
    "통합과학2",
    "과학탐구실험1",
    "과학탐구실험2",
    "물리학",
    "화학",
    "지구과학",
    "생명과학",
    "지구시스템과학",
    "행성우주과학",
    "기후변화와 환경상태",
    "융합과학탐구",
    "역학과 에너지",
    "물질과 에너지",
    "화학반응의 세계",
    "전자기와 양자",
  ],
  환경: [],
  공통: [],
  기타: [],
};

const dataTypeArr = ["SEED", "OpenAPI", "교과서", "기타"];

const EClassPage = () => {
  const navigate = useNavigate();
  const {
    title,
    description,
    gradeLabel,
    subjectLabel,
    dataTypeLabel,
    changeFieldValue,
    eClass,
    appendPage,
    eClassData,
  } = useEClassStore();

  const onClickSaveBtn = () => {
    const saveData = {
      title,
      description,
      gradeLabel,
      subjectLabel,
      dataTypeLabel,
      eClassData,
    };
    localStorage.setItem("eclass", JSON.stringify(saveData));
    alert("저장되었습니다.");
  };

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
                <Styled.Input
                  value={title}
                  onChange={e => changeFieldValue("title", e.target.value)}
                />
              </Styled.InputWrapper>
            </Styled.Block>
            <div>
              {eClass.map((page, idx) => (
                <Styled.PaperWrapper key={idx}>
                  <PaperWithToolBar
                    pageNum={idx}
                    activities={page}
                    eClassData={eClassData[idx]}
                  />
                </Styled.PaperWrapper>
              ))}
            </div>
          </section>
          <Styled.MainSection>
            <Styled.SubSection>
              <Styled.Label>학년</Styled.Label>
              <Dropdown title={gradeLabel}>
                {Object.keys(gradeObj).map(item => (
                  <Dropdown.Item key={item}>
                    {item}
                    <Dropdown.Submenu position="right">
                      {gradeObj[item].map(subItem => (
                        <Dropdown.Item
                          onClick={() =>
                            changeFieldValue(
                              "gradeLabel",
                              `${item} (${subItem})`
                            )
                          }
                          key={subItem}
                        >
                          {subItem}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Submenu>
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </Styled.SubSection>
            <Styled.SubSection>
              <Styled.Label>과목</Styled.Label>
              <Dropdown title={subjectLabel}>
                {Object.keys(subjectObj).map(item => (
                  <Dropdown.Item
                    key={item}
                    onClick={() => changeFieldValue("subjectLabel", `${item}`)}
                  >
                    {item}
                    {subjectObj[item].length > 0 && (
                      <Dropdown.Submenu position="right">
                        {subjectObj[item].map(subItem => (
                          <Dropdown.Item
                            onClick={e => {
                              e.stopPropagation();
                              changeFieldValue(
                                "subjectLabel",
                                `${item} (${subItem})`
                              );
                            }}
                            key={subItem}
                          >
                            {subItem}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Submenu>
                    )}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </Styled.SubSection>
            <Styled.SubSection>
              <Styled.Label>데이터 종류</Styled.Label>
              <Dropdown title={dataTypeLabel}>
                {dataTypeArr.map(type => (
                  <Dropdown.Item
                    key={type}
                    onClick={() => changeFieldValue("dataTypeLabel", type)}
                  >
                    {type}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </Styled.SubSection>
            <Styled.SubSection>
              <Styled.Label>설명</Styled.Label>
              <Styled.Textarea
                value={description}
                onChange={e => changeFieldValue("description", e.target.value)}
              />
            </Styled.SubSection>
            <Styled.SubSection>
              <Styled.Label>썸네일</Styled.Label>
              <Thumbnail />
            </Styled.SubSection>
            <Styled.SubSection>
              <Styled.SaveButton onClick={onClickSaveBtn}>
                저장
              </Styled.SaveButton>
            </Styled.SubSection>
            <Styled.SubSection onClick={() => navigate(-1)}>
              <Styled.CancelButton>취소</Styled.CancelButton>
            </Styled.SubSection>

            <Styled.SubSection style={{ marginTop: "30px" }}>
              <Styled.SaveButton onClick={appendPage}>
                + 페이지 추가
              </Styled.SaveButton>
            </Styled.SubSection>
          </Styled.MainSection>
        </div>
      </div>
    </Styled.Wrapper>
  );
};

export default EClassPage;
