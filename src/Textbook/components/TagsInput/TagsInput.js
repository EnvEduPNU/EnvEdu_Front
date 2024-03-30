import Dropdown from "react-multilevel-dropdown";
import * as Styled from "./Styled";
import { useState } from "react";
import useComponentPosition from "../../../DataLiteracy/hooks/useComponentPosition";
import Portal from "../../../Portal";
import { Button } from "react-bootstrap";
import { useTextbookStore } from "../../store/textbookStore";

const gradeObj = {
  초등: ["1", "2", "3", "4", "5", "6", "공통"],
  중등: ["1", "2", "3", "공통"],
  고등: ["1", "2", "3", "공통"],
};

const subjectObj = {
  과학: [
    "통합과학1",
    "통합과학2",
    "과학탐구실험1",
    "과학탐구실험2",
    "물리학",
    "화학",
    "지구과학",
    "지구시스템과학",
    "생명과학",
    "행성우주과학",
    "기후변화와 환경생태",
    "융합과학탐구",
    "역학과 에너지",
    "물질과 에너지",
    "화학반응의 세계",
    "전자기와 양자",
  ],
  사회: [],
  환경: [],
  공통: [],
  기타: [],
};

function TagsInput() {
  const { setSearchData } = useTextbookStore();
  const { ref, position } = useComponentPosition();
  const [visible, setVisible] = useState(false);
  const [tags, setTags] = useState([]);

  const onClickInput = () => {
    setVisible(true);
  };

  const onClickSearchBtn = () => {
    setSearchData(tags);
    setVisible(false);
  };

  return (
    <Styled.Wrapper ref={ref}>
      {tags.map(tag => (
        <SearchTag key={tag} tag={tag} setTags={setTags} />
      ))}
      <Styled.InputWrapper onClick={onClickInput}>
        <Styled.Input type="text" />
      </Styled.InputWrapper>
      <Styled.SearchBtn onClick={onClickSearchBtn}>
        <svg
          viewBox="0 0 40 40"
          focusable="false"
          role="presentation"
          aria-hidden="true"
          style={{ width: "24px", height: "24px" }}
        >
          <path fill="none" d="M0 0h40v40H0z"></path>
          <path d="M29.2 27.91a14.38 14.38 0 1 0-1.42 1.4l7.16 7.15.07.08 1.41-1.41zM18.45 6a12.36 12.36 0 0 1 8.35 3.23 12.24 12.24 0 0 1 4 8.59A12.39 12.39 0 1 1 17.88 6z"></path>
        </svg>
      </Styled.SearchBtn>
      {visible && (
        <Portal>
          <Styled.Modal
            style={{
              top: position.top + position.height + 10,
              right: position.right,
            }}
          >
            <section style={{ display: "flex", gap: 10, flex: 1 }}>
              <Styled.SubSection>
                <Styled.Label>학년</Styled.Label>
                <Dropdown title={"고등1"}>
                  {Object.keys(gradeObj).map(item => (
                    <Dropdown.Item key={item}>
                      {item}
                      <Dropdown.Submenu position="right">
                        {gradeObj[item].map(subItem => (
                          <Dropdown.Item
                            onClick={() => {
                              if (subItem === "공통") {
                                setTags(state => [
                                  ...state,
                                  {
                                    value: `${item} ${subItem}`,
                                    type: "gradeLabel",
                                  },
                                ]);
                              } else {
                                setTags(state => [
                                  ...state,
                                  {
                                    value: `${item}${subItem}`,
                                    type: "gradeLabel",
                                  },
                                ]);
                              }
                            }}
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
                <Dropdown title={"과학"}>
                  {Object.keys(subjectObj).map(item => (
                    <Dropdown.Item
                      key={item}
                      onClick={() =>
                        setTags(state => [
                          ...state,
                          { value: item, type: "subjectLabel" },
                        ])
                      }
                    >
                      {item}
                      {subjectObj[item].length > 0 && (
                        <Dropdown.Submenu position="right">
                          {subjectObj[item].map(subItem => (
                            <Dropdown.Item
                              onClick={e => {
                                e.stopPropagation();
                                setTags(state => [
                                  ...state,
                                  { value: subItem, type: "subjectLabel" },
                                ]);
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
            </section>
            <Styled.ButtonWrapper onClick={() => setVisible(false)}>
              <Button
                onClick={e => {
                  e.stopPropagation();
                  setVisible(false);
                }}
              >
                닫기
              </Button>
            </Styled.ButtonWrapper>
          </Styled.Modal>
        </Portal>
      )}
    </Styled.Wrapper>
  );
}

const SearchTag = ({ tag, setTags }) => {
  const deleteTag = () => {
    setTags(tags => tags.filter(t => t !== tag));
  };
  return (
    <Styled.SearchTag>
      <span>{tag.value}</span>
      <Styled.Button onClick={deleteTag}>
        <svg
          viewBox="0 0 40 40"
          focusable="false"
          role="presentation"
          // class="withIcon_icon__2nnc8"
          aria-hidden="true"
          style={{ width: "12px", height: "12px" }}
        >
          <path d="M33.4 8L32 6.6l-12 12-12-12L6.6 8l12 12-12 12L8 33.4l12-12 12 12 1.4-1.4-12-12 12-12z"></path>
        </svg>
      </Styled.Button>
    </Styled.SearchTag>
  );
};

export default TagsInput;
