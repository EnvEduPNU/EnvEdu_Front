import React, { useState, useEffect, useRef } from "react";
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

import AWS from "aws-sdk";

const s3 = new AWS.S3();

// AWS SDK 초기화
AWS.config.update({
  accessKeyId: `${process.env.ACCESS_KEY_ID}`,
  secretAccessKey: `${process.env.SECRET_ACCESS_KEY}`,
  region: `${process.env.REGION}`,
});

Quill.register("modules/imageActions", ImageActions);
Quill.register("modules/imageFormats", ImageFormats);

let imageFile = [];

const modules = {
  imageActions: {},
  imageFormats: {},
  toolbar: {
    container: [
      [{ align: [] }],
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: ["small", false, "large", "huge", "16px"] }], // 글자 크기 설정
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
    handlers: {
      image: imageHandler,
    },
  },
};

function imageHandler() {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    const range = this.quill.getSelection();

    // 이미지 파일을 Base64로 변환
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      this.quill.insertEmbed(range.index, "image", base64Image);
    };
    reader.readAsDataURL(file);

    imageFile = file;
    console.log("이미지 파일 들어오나 보자 : " + imageFile);
  };
}

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
  const [value, setValue] = useState();
  const [localContents, setLocalContents] = useState([]);
  const [contentName, setContentName] = useState("");
  const { contents, addContent, updateContent, clearContents } =
    useCreateLectureSourceStore();
  const [isEditing, setIsEditing] = useState(false);
  const [addTableFlag, setAddTableFlag] = useState(false);

  const quillRef = useRef(null);

  useEffect(() => {
    console.log("변경 : " + activeStep);
    imageFile = null;

    // activeStep이 변경될 때마다 localContents를 초기화(맨처음 스텝 만들때)
    setLocalContents([]);
    setContentName("");
    setValue("");
    setIsEditing(false);
    setAddTableFlag(false);

    // store에서 현재 activeStep에 해당하는 내용을 로드(이전의 데이터 로드, 혹은 스텝 이동시 이전 데이터 로드 할때)
    const stepData = contents.find((content) => content.stepNum === activeStep);
    if (stepData) {
      console.log("처음 stepData : " + JSON.stringify(stepData, null, 2));

      const contentsArray = Array.isArray(stepData.contents)
        ? stepData.contents
        : [stepData.contents];

      const formattedContents = contentsArray.map((item, index) => {
        // 만약 테이블이 있다면 object 형식이기 때문에 바꿔주기 위해서
        if (typeof item.content === "object") {
          item.content = JSON.stringify(item.content);
        }

        return item;
      });

      // img file 로그 체크용
      const fileLogCheck = formattedContents.map((item, index) => {
        if (item.type === "file") {
          console.log(
            "이미지파일 확인11 : " + JSON.stringify(item.content, null, 2)
          );

          return item.content;
        }

        return "noName";
      });

      console.log("파일 이름: " + fileLogCheck);

      setLocalContents(formattedContents);
      setContentName(stepData.contentName);
      setIsEditing(true);
    }
  }, [activeStep, contents]);

  const handleChange = (content, delta, source, editor) => {
    setValue(content);

    // Quill editor의 root element에서 이미지를 찾습니다.
    const quillEditor = quillRef.current.getEditor();
    const imageElements = quillEditor.root.querySelectorAll("img");

    imageElements.forEach((img) => {
      img.onload = () => {
        console.log(`Image size: ${img.width}x${img.height}`);
      };
    });
  };

  // 이미지 파일 저장하는 메서드
  // 포함하기 버튼에서 작동
  const handleSave = () => {
    const contentHtml = value; // ReactQuill의 value
    const quillEditor = quillRef.current.getEditor();
    const imageElements = quillEditor.root.querySelectorAll("img");

    let imgX = null;
    let imgY = null;

    imageElements.forEach((img) => {
      if (img.complete) {
        // 이미지가 이미 로드된 경우
        console.log(`Image size: ${img.width}x${img.height}`);
        imgX = img.width;
        imgY = img.height;
      } else {
        // 이미지가 아직 로드되지 않은 경우
        img.onload = () => {
          console.log(`Image size: ${img.width}x${img.height}`);
        };
      }
    });

    console.log("포함된 html : " + JSON.stringify(contentHtml, null, 2));

    if (imageFile) {
      console.log("이미지파일 확인 : " + imageFile.name);
      setLocalContents([
        ...localContents,
        { type: "html", content: contentHtml },
        { type: "file", content: imageFile, x: imgX, y: imgY },
      ]);
    } else {
      setLocalContents([
        ...localContents,
        { type: "html", content: contentHtml },
      ]);
    }

    imageFile = null;
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

  const handleDeleteContent = (index, deleteImage) => {
    // 특정 인덱스를 제외한 새로운 콘텐츠 배열 생성
    const newContents = localContents.filter((_, i) => i !== index);

    // deleteImage가 제공된 경우 새로운 객체를 추가
    if (deleteImage) {
      newContents.push({ type: "deleteImage", url: deleteImage });
    }

    // 상태 업데이트
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

  // 이미지 삭제 요청 함수
  const deleteImage = async (imageUrl) => {
    try {
      const response = await customAxios.delete("/api/images/delete", {
        headers: {
          "X-Previous-Image-URL": imageUrl,
        },
      });
      console.log("Image deleted successful:", response.data);
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  const handleNext = async () => {
    const stepData = {
      stepName: lectureName,
      stepNum: activeStep,
      contentName,
      contents: [],
      images: [],
    };
    let newLocalContents = [...localContents];

    console.log("타입 확인용 : " + JSON.stringify(localContents, null, 2));

    for (const item of localContents) {
      if (item.type === "deleteImage") {
        console.log("삭제해야하는 이미지 url : " + item.url);

        try {
          await deleteImage(item.url);
          console.log("이미지 삭제 성공:", item.url);
          newLocalContents = newLocalContents.filter(
            (content) => content.url !== item.url
          );
          setLocalContents(newLocalContents);
        } catch (error) {
          console.error("이미지 삭제 실패:", error);
        }
      }

      if (item.type === "html") {
        const div = document.createElement("div");
        div.innerHTML = item.content;
        const images = div.querySelectorAll("img");

        images.forEach((img) => {
          const src = img.src;
          if (src.startsWith("data:image/")) {
            const base64Data = src.split(",")[1]; // Extract base64 part
            stepData.contents.push({
              type: "img",
              src: base64Data,
              x: item.x,
              y: item.y,
            });
          } else {
            stepData.contents.push({
              type: "img",
              src,
              x: item.x,
              y: item.y,
            });
          }
        });
        stepData.contents.push(item);
      } else {
        if (item.type !== "deleteImage") {
          stepData.contents.push(item);
        }
      }
    }

    // Finish 스텝에서는 빈 배열 저장 안함
    if (stepCount >= activeStep) {
      console.log("스텝 카운트 : " + stepCount);
      console.log("액티브 스텝 : " + activeStep);
      console.log("최종 저장 stepData : " + JSON.stringify(stepData, null, 2));

      if (isEditing) {
        updateContent(activeStep - 1, stepData);

        alert("Step 업데이트 완료");
        console.log("업데이트된 데이터:", stepData);
      } else {
        addContent(stepData);
        alert("Step 저장 완료");
        console.log("저장된 데이터:", stepData);
      }
    }

    console.log(
      "이미지 숫자 확인 : " + JSON.stringify(stepData.images.length, null, 2)
    );

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

    {
      console.log("테이블은? : " + JSON.stringify(content, null, 2));
    }

    console.log(" 플래그 : " + addTableFlag);

    let parseContentData = null;

    // 첫번째 만드는 데이터 테이블 뷰
    if (addTableFlag) {
      console.log("첫번째 테이블");
      parseContentData = content;
    }
    // 수정하는 테이블 뷰
    else {
      parseContentData = parseContent(content);
    }

    if (
      !parseContentData ||
      !parseContentData.props ||
      !parseContentData.props.children
    ) {
      return <div>Invalid content</div>;
    }

    const dataContent =
      parseContentData.props.children.props.children.props.children;

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

    // paper 에 나오는 아이템들. 삭제 버튼을 통해서 지울 수 있다.
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
        ) : item.type === "img" ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              width: "100%",
            }}
          >
            <img src={item.content} style={{ width: item.x, height: item.y }} />

            <IconButton
              onClick={() => handleDeleteContent(index, item.content)}
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
            ref={quillRef}
            value={value}
            style={{ width: "55%", height: "88%", margin: "0 0 0 10px" }}
            onChange={handleChange}
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

            <>
              {stepCount < activeStep ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNext}
                  sx={{ width: "100%", marginLeft: "10px" }}
                >
                  Finish
                </Button>
              ) : (
                <>
                  {/* {console.log(
                    "스텝 카운트 : " +
                      stepCount +
                      " 액티브 스텝 : " +
                      activeStep
                  )} */}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleNext}
                    sx={{ width: "100%", marginLeft: "10px" }}
                  >
                    다음 단계
                  </Button>
                </>
              )}
            </>
          </div>
        </div>
      </Container>
    </DndProvider>
  );
}
