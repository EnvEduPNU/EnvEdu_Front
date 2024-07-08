import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css"; // Quill 스타일
import ReactQuill, { Quill } from "react-quill";
import {
  Container,
  Button,
  Paper,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import { ImageActions } from "@xeger/quill-image-actions";
import { ImageFormats } from "@xeger/quill-image-formats";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTableButton from "./button/DataTableButton";
import { customAxios } from "../../../../Common/CustomAxios";
import { useCreateLectureSourceStore } from "../../store/CreateLectureSourceStore";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

Quill.register("modules/imageActions", ImageActions);
Quill.register("modules/imageFormats", ImageFormats);

const modules = {
  imageActions: {},
  imageFormats: {},
  toolbar: [
    [{ align: [] }],
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: ["small", false, "large", "huge", "16px"] }], // 글자 크기 설정
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
  "video",
  "align",
  "float",
  "height",
  "width",
];
export default function TeacherWordProcessor({
  summary,
  lectureName,
  handleNextStep,
  activeStep,
  stepCount,
}) {
  const [value, setValue] = useState("");
  const [localContents, setLocalContents] = useState([]);
  const [contentName, setContentName] = useState("");
  const { contents, addContent, updateContent } = useCreateLectureSourceStore();
  const [isEditing, setIsEditing] = useState(false);
  const [addTableFlag, setAddTableFlag] = useState(false);

  useEffect(() => {
    // activeStep이 변경될 때마다 localContents를 초기화
    setLocalContents([]);
    setContentName("");
    setValue("");
    setIsEditing(false);

    // store에서 현재 activeStep에 해당하는 내용을 로드
    const stepData = contents.find((content) => content.stepNum === activeStep);
    if (stepData) {
      const contentsArray = Array.isArray(stepData.contents)
        ? stepData.contents
        : [stepData.contents];

      const formattedContents = contentsArray.map((item) => {
        if (typeof item.content === "object") {
          // 객체를 JSON 문자열로 변환하여 저장
          return { ...item, content: JSON.stringify(item.content) };
        }
        return item;
      });

      setLocalContents(formattedContents);
      setContentName(stepData.contentName);
      setIsEditing(true);
    }
  }, [activeStep, contents]);

  const handleSave = () => {
    const contentHtml = value; // ReactQuill의 value는 이미 HTML 형식
    setLocalContents([
      ...localContents,
      { type: "html", content: contentHtml },
    ]);
    setValue("");
  };

  const handleAddTitle = () => {
    const newContents = localContents.filter((item) => item.type !== "title");
    setLocalContents([...newContents, { type: "title", content: contentName }]);
  };

  const handleAddTextBox = () => {
    setLocalContents([...localContents, { type: "textBox", content: "" }]); // 새로운 빈 텍스트 박스를 추가
  };

  const handleTextBoxChange = (index, event) => {
    const newContents = [...localContents];
    newContents[index].content = event.target.value;
    setLocalContents(newContents);
  };

  const handleDeleteContent = (index) => {
    const newContents = localContents.filter((_, i) => i !== index);
    setLocalContents(newContents);
  };

  const handleSelectData = async (type, id) => {
    try {
      let path = "";
      if (type === "수질 데이터") {
        path = `/ocean-quality/mine/chunk?dataUUID=${id}`;
      } else if (type === "대기질 데이터") {
        path = `/air-quality/mine/chunk?dataUUID=${id}`;
      } else if (type === "SEED") {
        path = `/seed/mine/chunk?dataUUID=${id}`;
      } else if (type === "CUSTOM") {
        path = `/dataLiteracy/customData/download/${id}`;
      }

      const response = await customAxios.get(path);
      const dataContent = response.data; // JSON 형식의 데이터를 가져옴

      // JSON 데이터를 테이블 형식으로 변환하여 contents에 추가
      let headers = Object.keys(dataContent[0]).filter(
        (key) =>
          key !== "id" &&
          key !== "dataUUID" &&
          key !== "saveDate" &&
          key !== "dateString" &&
          key !== "sessionid" &&
          key !== "unit"
      );

      const attributesToCheck = [
        "co2",
        "dox",
        "dust",
        "hum",
        "hum_EARTH",
        "lux",
        "ph",
        "pre",
        "temp",
        "tur",
      ];

      for (const attribute of attributesToCheck) {
        const isAllZero = response.data.every(
          (item) => item[attribute] === -99999
        );
        if (isAllZero) {
          headers = headers.filter((header) => header !== attribute);
        }
      }

      const tableContent = (
        <div style={{ width: "auto", overflowX: "auto" }}>
          <div
            style={{
              transform: "scale(1)",
              transformOrigin: "top left",
            }}
          >
            <table
              style={{
                width: "100%",
                marginTop: "10px",
                borderCollapse: "collapse",
                tableLayout: "fixed", // 테이블 셀 너비를 고정
              }}
            >
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header}
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        backgroundColor: "#f2f2f2",
                        wordWrap: "break-word", // 긴 단어를 줄바꿈
                        fontSize: "10px", // 테이블 길이에 맞춰서 size 조절 수정해야함
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataContent.map((row, rowIndex) => (
                  <tr key={rowIndex} style={{ borderBottom: "1px solid #ddd" }}>
                    {headers.map((header) => (
                      <td
                        key={`${rowIndex}-${header}`}
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          wordWrap: "break-word", // 긴 단어를 줄바꿈
                          fontSize: "10px", // 테이블 길이에 맞춰서 size 조절 수정해야함
                        }}
                      >
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

      setLocalContents([
        ...localContents,
        { type: "data", content: tableContent },
      ]);

      setAddTableFlag(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleNext = () => {
    const stepData = {
      stepName: lectureName,
      stepNum: activeStep,
      contentName,
      contents: localContents,
    };
    // Finish 스텝에서는 빈 배열 저장 안함
    if (stepCount > activeStep) {
      console.log("스텝 카운트 : " + stepCount);
      console.log("액티브 스텝 : " + activeStep);

      if (isEditing) {
        updateContent(activeStep, stepData);
        alert("Step 업데이트 완료");
        console.log("업데이트된 데이터:", stepData);
      } else {
        addContent(stepData);
        alert("Step 저장 완료");
        console.log("저장된 데이터:", stepData);
      }
    }

    handleNextStep();
  };

  const createElementFromJson = (json) => {
    if (typeof json === "string") {
      json = JSON.parse(json);
    }

    if (typeof json === "object" && json !== null) {
      const { type, props } = json;
      const children = props.children;

      return React.createElement(
        type,
        { ...props },
        Array.isArray(children)
          ? children.map((child, index) => createElementFromJson(child))
          : children
      );
    }

    return json;
  };

  // DataTable Component
  const DataTableLoad = ({ content }) => {
    const parseContent = (content) => {
      // Parse the JSON string into an object
      try {
        return JSON.parse(content);
      } catch (error) {
        console.error("Failed to parse content:", error);
        return null;
      }
    };
    let parsedContent = null;

    if (addTableFlag) {
      parsedContent = content;
    } else {
      parsedContent = parseContent(content);
    }

    if (
      !parsedContent ||
      !parsedContent.props ||
      !parsedContent.props.children
    ) {
      return <div>Invalid content</div>;
    }

    const dataContent =
      parsedContent.props.children.props.children.props.children;

    if (!Array.isArray(dataContent) || dataContent.length < 1) {
      return <div>Invalid data content</div>;
    }

    const headers = dataContent[0].props.children.props.children.map(
      (header) => header.key
    );

    const body = dataContent[1].props.children.map((body) =>
      body.props.children.map((node) => node.props.children)
    );

    return (
      <div style={{ width: "auto", overflowX: "auto" }}>
        <div style={{ transform: "scale(1)", transformOrigin: "top left" }}>
          <table
            style={{
              width: "100%",
              marginTop: "10px",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      backgroundColor: "#f2f2f2",
                      wordWrap: "break-word",
                      fontSize: "10px",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex} style={{ borderBottom: "1px solid #ddd" }}>
                  {headers.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        wordWrap: "break-word",
                        fontSize: "10px",
                      }}
                    >
                      {row[colIndex]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const DraggableItem = ({
    item,
    index,
    moveItem,
    handleDeleteContent,
    handleTextBoxChange,
  }) => {
    const ref = React.useRef(null);
    const [, drop] = useDrop({
      accept: "content",
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          moveItem(draggedItem.index, index);
          draggedItem.index = index;
        }
      },
    });

    const [{ isDragging }, drag] = useDrag({
      type: "content",
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    drag(drop(ref));

    return (
      <div
        ref={ref}
        style={{
          opacity: isDragging ? 0.5 : 1,
          position: "relative",
          margin: "10px 0",
        }}
      >
        {item.type === "html" ? (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              style={{ whiteSpace: "pre-wrap" }}
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
            <IconButton
              onClick={() => handleDeleteContent(index)}
              aria-label="delete"
              color="secondary"
              sx={{ width: "30px" }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ) : item.type === "textBox" ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              width: "100%",
            }}
          >
            <TextField
              value={item.content}
              onChange={(event) => handleTextBoxChange(index, event)}
              variant="outlined"
              fullWidth
              multiline
              minRows={5}
              maxRows={10}
            />
            <IconButton
              onClick={() => handleDeleteContent(index)}
              aria-label="delete"
              color="secondary"
              sx={{ width: "30px" }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ) : item.type === "title" ? (
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            {item.content}
          </Typography>
        ) : item.type === "data" ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              width: "100%",
            }}
          >
            <DataTableLoad content={item.content} />
            <IconButton
              onClick={() => handleDeleteContent(index)}
              aria-label="delete"
              color="secondary"
              sx={{ width: "30px" }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ) : null}
      </div>
    );
  };

  const moveItem = (dragIndex, hoverIndex) => {
    const draggedItem = localContents[dragIndex];
    const newContents = [...localContents];
    newContents.splice(dragIndex, 1);
    newContents.splice(hoverIndex, 0, draggedItem);
    setLocalContents(newContents);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontSize: "3vh",
              padding: "20px 0 0 0 ",
            }}
          >
            {lectureName}
          </Typography>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
        >
          <TextField
            label="콘텐츠 이름"
            value={contentName}
            onChange={(e) => setContentName(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{ marginRight: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddTitle}
            sx={{ height: "56px" }} // TextField와 버튼 높이를 맞춤
          >
            제목 추가
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "70rem",
            height: "36.5rem",
          }}
        >
          {/* 왼쪽에 과제 만드는 미리보기란에 랜더링 되는 곳 */}
          <Paper
            style={{
              padding: 20,
              width: "100%",
              height: "100%",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              overflowY: "auto",
            }}
          >
            {localContents.map((item, index) => (
              <DraggableItem
                key={index}
                index={index}
                item={item}
                moveItem={moveItem}
                handleDeleteContent={handleDeleteContent}
                handleTextBoxChange={handleTextBoxChange}
              />
            ))}
          </Paper>

          {/* 오른쪽 WordProcessor 편집창 */}
          <ReactQuill
            value={value}
            style={{ width: "55%", height: "88%", margin: "0 0 0 10px" }}
            onChange={setValue}
            modules={modules}
            formats={formats}
            placeholder="내용을 입력하세요..."
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "30%",
            }}
          >
            {/* 데이터 추가하기 버튼 */}
            <DataTableButton
              summary={summary}
              onSelectData={handleSelectData}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTextBox}
              sx={{ margin: "20px 10px 0 10px", width: "50%" }}
            >
              답변 박스 추가
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "20px 0 0 0",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ width: "100%" }}
            >
              포함하기
            </Button>

            {isEditing ? (
              // 다음 단계라고 써있지만 사실상 수정하기
              <Button
                variant="contained"
                color="secondary"
                onClick={handleNext}
                sx={{ width: "100%", marginLeft: "10px" }}
              >
                다음단계
              </Button>
            ) : (
              <>
                {stepCount === activeStep ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleNext}
                    sx={{ width: "100%", marginLeft: "10px" }}
                  >
                    Finish
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleNext}
                    sx={{ width: "100%", marginLeft: "10px" }}
                  >
                    다음 단계
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </DndProvider>
  );
}
