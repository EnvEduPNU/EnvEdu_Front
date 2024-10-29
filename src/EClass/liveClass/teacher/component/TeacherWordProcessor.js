import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill 스타일
import {
  Container,
  Button,
  Paper,
  Typography,
  TextField,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Modal,
} from '@mui/material';
import { ImageActions } from '@xeger/quill-image-actions';
import { ImageFormats } from '@xeger/quill-image-formats';
import DeleteIcon from '@mui/icons-material/Delete';
import DataTableButton from './button/DataTableButton';
import { customAxios } from '../../../../Common/CustomAxios';
import { useCreateLectureSourceStore } from '../../store/CreateLectureSourceStore';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './TeacherWordProcessor.scss';
import { useNavigate } from 'react-router-dom';

import * as XLSX from 'xlsx'; // 엑셀 파일 처리를 위한 라이브러리
import ExcelDataModal from '../../../../Data/MyData/modal/ExcelDataModal';

Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/imageFormats', ImageFormats);

let imageFile = [];

const modules = {
  imageActions: {},
  imageFormats: {},
  toolbar: {
    container: [
      [{ align: [] }],
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: ['small', false, 'large', 'huge', '16px'] }], // 글자 크기 설정
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    handlers: {
      image: imageHandler,
    },
  },
};

function imageHandler() {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    const range = this.quill.getSelection();

    // 이미지 파일을 Base64로 변환
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      this.quill.insertEmbed(range.index, 'image', base64Image);
    };
    reader.readAsDataURL(file);

    imageFile = file;
  };
}

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'link',
  'image',
  'video',
  'align',
  'float',
  'height',
  'width',
];

export default function TeacherWordProcessor({
  summary,
  lectureName,
  handleNextStep,
  onLectureNameChange,
  activeStep,
  stepCount,
  stepperStepName,
  setStepperStepName,
}) {
  const [value, setValue] = useState();
  const [localContents, setLocalContents] = useState([]);
  const [contentName, setContentName] = useState('');
  const { contents, addContent, updateContent, clearContents } =
    useCreateLectureSourceStore();
  const [isEditing, setIsEditing] = useState(false);
  const [addTableFlag, setAddTableFlag] = useState(false);

  const [isUpdated, setIsUpdated] = useState(false); // 첫 번째 useEffect 완료 상태

  const [excelModalOpen, setExcelModalOpen] = useState(false); // 엑셀 모달 상태 추가
  const [excelData, setExcelData] = useState([]); // 엑셀 데이터를 저장할 상태

  const quillRef = useRef(null);
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false); // 메뉴 대신 사용할 모달 상태

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  // 첫 번째 useEffect: stepperStepName 배열을 업데이트
  useEffect(() => {
    // if (stepperStepName && stepperStepName.length > 0) {
    //   stepperStepName.forEach((step, index) => {
    //     updateContent(index, step); // 각 step을 updateContent로 업데이트
    //   });

    setIsUpdated(true); // 업데이트 완료 후 isUpdated를 true로 설정
    // }
  }, []);

  useEffect(() => {
    if (stepperStepName && stepperStepName.length > 0) {
      setIsUpdated(true);
    }
  }, [activeStep, stepperStepName]);

  // 두 번째 useEffect: isUpdated가 true일 때 실행
  useEffect(() => {
    if (isUpdated) {
      imageFile = null;

      console.log(
        '[TeacherWordProcessor] stepperStepName : ' +
          JSON.stringify(stepperStepName, null, 2),
      );

      const stepNumbers = contents.map((contentss) => contentss.stepNum);

      console.log('전체 스텝수: ' + stepCount);
      console.log('step 넘버들: ' + stepNumbers);
      console.log('activeStep : ' + activeStep);

      let stepData = null;

      // store에서 현재 activeStep에 해당하는 내용을 로드
      if (stepNumbers.includes(activeStep)) {
        // 현재 스토어에서 로드
        contents.forEach((contentss) => {
          if (contentss.stepNum === activeStep) {
            stepData = contentss;
          }
        });

        console.log(
          '스토어에서 불러온 stepData : ' + JSON.stringify(stepData, null, 2),
        );
      } else if (stepperStepName.length > 0) {
        // 이미 만들어진 E-Class에서 로드
        stepperStepName.forEach((contentss) => {
          if (contentss.stepNum === activeStep) {
            stepData = contentss;
          }
        });

        console.log(
          '이전 스텝 저장소에서 불러온 stepData : ' +
            JSON.stringify(stepData, null, 2),
        );
      }

      // stepData 가 존재할 경우 처리
      if (stepData) {
        const contentsArray = Array.isArray(stepData.contents)
          ? stepData.contents
          : [stepData.contents];

        const formattedContents = contentsArray
          .filter((content) => {
            if (content.type === 'img' && !content.content) {
              return false;
            }
            return true;
          })
          .map((item, index) => {
            if (typeof item.content === 'object' && item.type !== 'file') {
              item.content = JSON.stringify(item.content);
            }
            return item;
          });

        setLocalContents(formattedContents);
        setContentName(stepData.contentName);
        setIsEditing(true);
      }

      setIsUpdated(false);
    }
  }, [isUpdated, activeStep, contents, stepperStepName]);

  // isUpdated와 activeStep 변경 시 실행
  // 엑셀 파일 업로드 및 데이터 처리 메서드
  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return; // 파일이 선택되지 않으면 리턴

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // 엑셀 데이터를 상태로 저장하고 모달을 열기
      setExcelData(jsonData);
      setExcelModalOpen(true);
    };
    reader.readAsArrayBuffer(file);
  };

  // 엑셀 모달 닫기
  const handleExcelModalClose = () => {
    setExcelModalOpen(false);
  };

  // 컴퓨터에서 엑셀 파일 불러오기
  const handleAddDataChartFromComputer = () => {
    handleModalClose();
    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', '.xlsx, .xls');
    fileInput.onchange = handleExcelUpload;
    fileInput.click();
  };

  // MyData에서 불러오기
  const handleAddDataChartFromMyData = () => {
    handleModalClose();
    alert('MyData에서 데이터를 불러옵니다.'); // 여기에서 실제 MyData 호출 처리
    // MyData를 불러오는 로직을 추가할 수 있습니다.
  };

  const handleChange = (content, delta, source, editor) => {
    setValue(content);

    // Quill editor의 root element에서 이미지를 찾습니다.
    const quillEditor = quillRef.current.getEditor();
    const imageElements = quillEditor.root.querySelectorAll('img');

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
    const imageElements = quillEditor.root.querySelectorAll('img');

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

    console.log('포함된 html : ' + JSON.stringify(contentHtml, null, 2));

    if (imageFile) {
      console.log('이미지파일 확인 : ' + imageFile.name);
      setLocalContents([
        ...localContents,
        { type: 'html', content: contentHtml },
        { type: 'file', content: imageFile, x: imgX, y: imgY },
      ]);
    } else {
      setLocalContents([
        ...localContents,
        { type: 'html', content: contentHtml },
      ]);
    }

    imageFile = null;
    setValue('');
  };

  // const handleAddTitle = () => {
  //   const newContents = localContents.filter((item) => item.type !== 'title');
  //   setLocalContents([{ type: 'title', content: contentName }, ...newContents]); // title을 항상 맨 위에 추가
  // };

  const handleAddTextBox = () => {
    setLocalContents([...localContents, { type: 'textBox', content: '' }]); // 새로운 빈 텍스트 박스를 추가
  };

  // 모달에서 데이터를 확정한 후 content에 넣기 위한 함수
  const handleSaveExcelData = () => {
    console.log('로컬 컨텐츠 확인 : ' + JSON.stringify(localContents, null, 2));
    // 이미 'dataInChartButton'이 있는지 확인
    const isChartButtonAdded = localContents.some(
      (content) => content.type === 'dataInChartButton',
    );

    // 이미 추가된 경우 경고 메시지를 표시하고 추가를 중단
    if (isChartButtonAdded) {
      alert('그래프 그리기 버튼은 한 번만 추가할 수 있습니다.');
      return;
    }
    setLocalContents([
      ...localContents,
      { type: 'dataInChartButton', content: '' }, // 엑셀 데이터를 content에 저장
    ]);
  };

  // 모달에서 데이터를 확정한 후 content에 넣기 위한 함수
  const handleAfterExcelData = (EclassTable) => {
    console.log('원본 컨텐츠: ' + JSON.stringify(localContents, null, 2));
    const updatedContents = [...localContents];
    const lastIndex = updatedContents.length - 1;

    console.log(
      '테이블 저장 잘 됐나 확인 1: ' + JSON.stringify(EclassTable, null, 2),
    );

    // 마지막에 추가된 dataInChartButton에 데이터를 저장
    if (updatedContents[lastIndex].type === 'dataInChartButton') {
      updatedContents[lastIndex].content = EclassTable.dataUUID; // 테이블 데이터를 content에 저장
    }

    console.log(
      '테이블 저장 잘 됐나 확인 2: ' + JSON.stringify(updatedContents, null, 2),
    );

    setLocalContents(updatedContents);
    setExcelModalOpen(false); // 모달 닫기
  };

  const handleTextBoxChange = (index, event) => {
    const newContents = [...localContents];
    newContents[index].content = event.target.value;
    setLocalContents(newContents);
  };

  const handleDeleteContent = (index, deleteImage) => {
    // 특정 인덱스를 제외한 새로운 콘텐츠 배열 생성
    const newContents = localContents.filter((_, i) => i !== index);

    console.log('컨텐츠 지을 부분 : ' + JSON.stringify(newContents, null, 2));

    // deleteImage가 제공된 경우 새로운 객체를 추가
    if (deleteImage) {
      newContents.push({ type: 'deleteImage', url: deleteImage });
    }

    // 상태 업데이트
    setLocalContents(newContents);
  };

  const handleSelectData = async (type, id) => {
    try {
      let path = '';
      if (type === '수질 데이터') {
        path = `/ocean-quality/mine/chunk?dataUUID=${id}`;
      } else if (type === '대기질 데이터') {
        path = `/air-quality/mine/chunk?dataUUID=${id}`;
      } else if (type === 'SEED') {
        path = `/seed/mine/chunk?dataUUID=${id}`;
      } else if (type === 'CUSTOM') {
        path = `/dataLiteracy/customData/download/${id}`;
      }

      const response = await customAxios.get(path);
      const dataContent = response.data; // JSON 형식의 데이터를 가져옴

      // JSON 데이터를 테이블 형식으로 변환하여 contents에 추가
      let headers = Object.keys(dataContent[0]).filter(
        (key) =>
          key !== 'id' &&
          key !== 'dataUUID' &&
          key !== 'saveDate' &&
          key !== 'dateString' &&
          key !== 'sessionid' &&
          key !== 'unit',
      );

      const attributesToCheck = [
        'co2',
        'dox',
        'dust',
        'hum',
        'hum_EARTH',
        'lux',
        'ph',
        'pre',
        'temp',
        'tur',
      ];

      for (const attribute of attributesToCheck) {
        const isAllZero = response.data.every(
          (item) => item[attribute] === -99999,
        );
        if (isAllZero) {
          headers = headers.filter((header) => header !== attribute);
        }
      }

      const tableContent = (
        <div style={{ width: 'auto', overflowX: 'auto' }}>
          <div
            style={{
              transform: 'scale(1)',
              transformOrigin: 'top left',
            }}
          >
            <table
              style={{
                width: '100%',
                marginTop: '10px',
                borderCollapse: 'collapse',
                tableLayout: 'fixed', // 테이블 셀 너비를 고정
              }}
            >
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header}
                      style={{
                        border: '1px solid #ddd',
                        padding: '8px',
                        backgroundColor: '#f2f2f2',
                        wordWrap: 'break-word', // 긴 단어를 줄바꿈
                        fontSize: '10px', // 테이블 길이에 맞춰서 size 조절 수정해야함
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataContent.map((row, rowIndex) => (
                  <tr key={rowIndex} style={{ borderBottom: '1px solid #ddd' }}>
                    {headers.map((header) => (
                      <td
                        key={`${rowIndex}-${header}`}
                        style={{
                          border: '1px solid #ddd',
                          padding: '8px',
                          wordWrap: 'break-word', // 긴 단어를 줄바꿈
                          fontSize: '10px', // 테이블 길이에 맞춰서 size 조절 수정해야함
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
        { type: 'data', content: tableContent },
      ]);

      setAddTableFlag(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // 이미지 삭제 요청 함수
  const deleteImage = async (imageUrl) => {
    try {
      const response = await customAxios.delete('/api/images/delete', {
        headers: {
          'X-Previous-Image-URL': imageUrl,
        },
      });
      console.log('Image deleted successful:', response.data);
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const handleNext = async (moveEclass) => {
    const stepData = {
      stepName: lectureName,
      stepNum: activeStep,
      contentName,
      contents: [],
    };
    let newLocalContents = [...localContents];

    console.log('타입 확인용 : ' + JSON.stringify(localContents, null, 2));

    for (const item of localContents) {
      if (item.type === 'deleteImage') {
        console.log('삭제해야하는 이미지 url : ' + item.url);

        try {
          await deleteImage(item.url);
          console.log('이미지 삭제 성공:', item.url);
          newLocalContents = newLocalContents.filter(
            (content) => content.url !== item.url,
          );
          setLocalContents(newLocalContents);
        } catch (error) {
          console.error('이미지 삭제 실패:', error);
        }
      }

      if (item.type === 'html') {
        const div = document.createElement('div');
        div.innerHTML = item.content;
        const images = div.querySelectorAll('img');

        images.forEach((img) => {
          const src = img.src;
          if (src.startsWith('data:image/')) {
            const base64Data = src.split(',')[1]; // Extract base64 part
            stepData.contents.push({
              type: 'img',
              src: base64Data,
              x: item.x,
              y: item.y,
            });
          } else {
            stepData.contents.push({
              type: 'img',
              src,
              x: item.x,
              y: item.y,
            });
          }
        });
        stepData.contents.push(item);
      } else {
        if (item.type !== 'deleteImage' && item.type !== 'file') {
          stepData.contents.push(item);
        }

        if (item.type === 'file') {
          console.log('이미지 이름 : ' + item.content.name);
          stepData.contents.push(item);
        }
      }
    }

    if (stepCount >= activeStep) {
      console.log('스텝 카운트 : ' + stepCount);
      console.log('액티브 스텝 : ' + activeStep);
      console.log('최종 저장 stepData : ' + JSON.stringify(stepData, null, 2));
      stepData.contents.forEach((content) => {
        if (content.type === 'file') {
          console.log('step 저장전 이미지 확인2222 : ' + content.content.name);
        }
      });

      if (isEditing) {
        // clearContents();
        if (activeStep > 0) {
          updateContent(activeStep - 1, stepData);
        } else {
          updateContent(activeStep, stepData);
        }

        alert('Step 업데이트 완료');
        console.log('업데이트된 데이터:', stepData);
      } else {
        addContent(stepData);
        alert('Step 저장 완료');
        console.log('저장된 데이터:', stepData);
      }
    }

    // 상위 컴포넌트의 저장 메서드
    handleNextStep(moveEclass);

    setLocalContents([]);
    setContentName('');
    setIsEditing(false);
  };

  const createElementFromJson = (json) => {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }

    if (typeof json === 'object' && json !== null) {
      const { type, props } = json;
      const children = props.children;

      return React.createElement(
        type,
        { ...props },
        Array.isArray(children)
          ? children.map((child, index) => createElementFromJson(child))
          : children,
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
        console.error('Failed to parse content:', error);
        return null;
      }
    };

    {
      console.log('테이블은? : ' + JSON.stringify(content, null, 2));
    }

    console.log(' 플래그 : ' + addTableFlag);

    let parseContentData = null;

    // 첫번째 만드는 데이터 테이블 뷰
    if (addTableFlag) {
      console.log('첫번째 테이블');
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
      (header) => header.key,
    );

    const body = dataContent[1].props.children.map((body) =>
      body.props.children.map((node) => node.props.children),
    );

    return (
      <div style={{ width: 'auto', overflowX: 'auto' }}>
        <div style={{ transform: 'scale(1)', transformOrigin: 'top left' }}>
          <table
            style={{
              width: '100%',
              marginTop: '10px',
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
            }}
          >
            <thead>
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    style={{
                      border: '1px solid #ddd',
                      padding: '8px',
                      backgroundColor: '#f2f2f2',
                      wordWrap: 'break-word',
                      fontSize: '10px',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex} style={{ borderBottom: '1px solid #ddd' }}>
                  {headers.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      style={{
                        border: '1px solid #ddd',
                        padding: '8px',
                        wordWrap: 'break-word',
                        fontSize: '10px',
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

    // title 타입이 아닐 때만 드래그 기능을 적용
    const [, drop] = useDrop({
      accept: 'content',
      hover: (draggedItem) => {
        if (draggedItem.index !== index && item.type !== 'title') {
          moveItem(draggedItem.index, index);
          draggedItem.index = index;
        }
      },
    });

    const [{ isDragging }, drag] = useDrag({
      type: 'content',
      item: { index },
      canDrag: item.type !== 'title', // title 타입은 드래그 불가
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    // title 타입이 아닌 경우에만 drag 기능을 적용
    if (item.type !== 'title') {
      drag(drop(ref));
    }

    return (
      <div
        ref={ref}
        style={{
          opacity: isDragging ? 0.5 : 1,
          position: 'relative',
          margin: '10px 0',
        }}
      >
        {item.type === 'html' ? (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div
              style={{ whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
            <IconButton
              onClick={() => handleDeleteContent(index)}
              aria-label="delete"
              color="secondary"
              sx={{ width: '30px' }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ) : item.type === 'textBox' ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              width: '100%',
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
              sx={{ width: '30px' }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ) : item.type === 'title' ? (
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            {item.content}
          </Typography>
        ) : item.type === 'data' ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              width: '100%',
            }}
          >
            <DataTableLoad content={item.content} />
            <IconButton
              onClick={() => handleDeleteContent(index)}
              aria-label="delete"
              color="secondary"
              sx={{ width: '30px' }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ) : item.type === 'img' ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              width: '100%',
            }}
          >
            <img src={item.content} style={{ width: item.x, height: item.y }} />
            <IconButton
              onClick={() => handleDeleteContent(index, item.content)}
              aria-label="delete"
              color="secondary"
              sx={{ width: '30px' }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ) : item.type === 'dataInChartButton' ? (
          <>
            <div style={{ width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                {/* 그래프 그리기 버튼 */}
                <Button
                  sx={{
                    backgroundColor: '#6200ea',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#3700b3',
                    },
                  }}
                  onClick={handleNavigate}
                >
                  그래프 그리기
                </Button>

                {/* 삭제 버튼 */}
                <IconButton
                  onClick={() => handleDeleteContent(index)}
                  aria-label="delete"
                  color="secondary"
                  sx={{ width: '30px' }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>

              {/* 큰 박스 추가 */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '300px',
                  mt: 3,
                  borderRadius: '15px',
                  backgroundColor: '#f3f3f3',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* + 버튼 */}
                <Button
                  sx={{
                    backgroundColor: '#6200ea',
                    color: 'white',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    fontSize: '2rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      backgroundColor: '#3700b3',
                    },
                  }}
                  onClick={handleModalOpen}
                >
                  +
                </Button>
              </Box>

              <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="data-modal-title"
                aria-describedby="data-modal-description"
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                  }}
                >
                  <Typography id="data-modal-title" variant="h6" component="h2">
                    데이터 추가
                  </Typography>
                  <Button onClick={handleAddDataChartFromComputer}>
                    내 컴퓨터에서 불러오기
                  </Button>
                  <Button onClick={handleAddDataChartFromMyData}>
                    MyData에서 불러오기
                  </Button>
                </Box>
              </Modal>

              {/* 엑셀 데이터를 처리하는 모달 */}
              {excelModalOpen && (
                <ExcelDataModal
                  open={excelModalOpen}
                  handleClose={handleExcelModalClose}
                  data={excelData}
                  eclassFlag={excelModalOpen}
                  onSave={handleAfterExcelData} // 모달에서 저장된 데이터를 처리
                />
              )}
            </div>
          </>
        ) : null}
      </div>
    );
  };

  const handleNavigate = () => {
    const id = 'drawGraph';
    navigate(`/data-in-chart?id=${id}`); // 쿼리 파라미터로 id 전달
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
      <Container disableGutters sx={{ minHeight: '20rem' }}>
        {stepCount >= activeStep ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '36.5rem',
              }}
            >
              {/* 왼쪽에 과제 만드는 미리보기란에 랜더링 되는 곳 */}
              <Paper
                style={{
                  padding: 20,
                  width: '100%',
                  height: '100%',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                  overflowY: 'auto',
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
                style={{ width: '55%', height: '88%', margin: '0 0 0 10px' }}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                placeholder="내용을 입력하세요..."
              />
            </div>

            <div
              style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  width: '100%',
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
                  className="yellow-btn" // yellow-btn 클래스 적용
                  onClick={handleAddTextBox}
                  sx={{ margin: '20px 10px 0 0', width: '10rem' }}
                >
                  답변 박스 추가
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveExcelData}
                  sx={{ margin: '20px 10px 0 0', width: '10rem' }}
                >
                  그래프 그리기 추가
                </Button>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  margin: '20px 0 0 0',
                  width: '100%',
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  sx={{ width: '10rem', marginRight: '1rem' }}
                >
                  포함하기
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNext}
                  sx={{ width: '10rem' }}
                >
                  다음 단계
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {' '}
            {/* 설명 및 버튼 박스 */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid lightgray',
                borderRadius: '8px',
                padding: '20px',
                marginTop: '20px',
                height: '20rem',
              }}
            >
              <Typography variant="h5">
                Finish 버튼으로 E-Class 생성을 완료하세요.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  maxWidth: '600px',
                  marginTop: '20px',
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    flexGrow: 1,
                    marginRight: '10px',
                    borderRadius: '8px',
                  }}
                  onClick={() => handleNext(true)}
                >
                  E-Class 바로 실행
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    flexGrow: 1.5,
                    borderRadius: '8px',
                  }}
                  onClick={handleNext}
                >
                  Finish
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Container>
    </DndProvider>
  );
}
