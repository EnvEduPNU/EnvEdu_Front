import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useNavigate 추가
import TableOrGraph from '../component/DrawGraph/TableOrGraph';
import LeftSlidePage from './leftSlidePage';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'; // Material-UI 아이콘
import DeleteIcon from '@mui/icons-material/Delete'; // 삭제 아이콘

import usePhotoStore from '../store/photoStore';
import LeftTeacherAssignTable from './leftTeacherAssignTable';

function DataInChartPage() {
  const [dataCategory, setDataCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [photoList, setPhotoList] = useState([]); // 사진 리스트 상태
  const [selectedPhoto, setSelectedPhoto] = useState(null); // 모달에 표시할 선택된 사진
  const [openModal, setOpenModal] = useState(false); // 모달 상태

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id'); // 쿼리 파라미터에서 id 받기
  const uuid = searchParams.get('uuid');
  const username = searchParams.get('username');
  const contentName = searchParams.get('contentName');
  const stepNum = searchParams.get('stepNum');
  const content = searchParams.get('content');

  useEffect(() => {
    console.log(
      '선생님이 지정한 테이블 uuid : ' + JSON.stringify(content, null, 2),
    );

    console.log(
      '데이터 카테고리 체크 : ' + JSON.stringify(dataCategory, null, 2),
    );
  }, []);

  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

  const { setPhotoStore, setStorePhotoList, getPhotoStore, getStorePhotoList } =
    usePhotoStore(); // zustand에서 상태 확인을 위해 getPhotoStore, getStorePhotoList 가져옴

  useEffect(() => {
    const username = localStorage.getItem('username');

    if (!username) {
      alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      window.location.href = '/login'; // 로그인 페이지로 이동
    } else {
      setIsLoading(false); // 로그인 확인이 완료되면 로딩 상태 해제
    }
  }, []);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPhoto(null);
  };

  const handleDeletePhoto = (index) => {
    setPhotoList((prevList) => prevList.filter((_, i) => i !== index));
  };

  // 새로운 사진을 추가하는 함수
  const handleAddPhoto = (newPhoto) => {
    if (photoList.length >= 3) {
      alert('최대 3개의 사진만 저장할 수 있습니다.');
      return;
    }
    setPhotoList((prevList) => [...prevList, newPhoto]);
  };

  // 기본 빈 행 수 설정
  const defaultRows = 3; // 기본적으로 3개의 빈 행
  const emptyRows =
    defaultRows - photoList.length > 0 ? defaultRows - photoList.length : 0; // 빈 행 계산

  // 제출 버튼을 클릭했을 때 photoList와 함께 이전 페이지로 이동하는 함수
  const handleSubmit = () => {
    // console.log(' 전달 전 확인 : ' + JSON.stringify(photoList, null, 2));

    const photoStore = {
      uuid: uuid,
      username: username,
      contentName: contentName,
      stepNum: stepNum,
    };

    // console.log(' 전달 전 확인 : ' + JSON.stringify(photoStore, null, 2));

    // zustand store에 데이터 저장
    setPhotoStore(photoStore);
    setStorePhotoList(photoList);

    // 저장된 상태를 console로 확인
    console.log('Stored photoStore:', getPhotoStore());
    console.log('Stored photoList:', getStorePhotoList());

    navigate(-1);
  };

  // 로딩 중일 때는 로딩 화면을 보여줌
  if (isLoading) {
    return <div>로딩 중...</div>; // 로딩 중 메시지 표시
  }

  // 색상 및 스타일 조건
  const isDrawGraph = id === 'drawGraph';
  const boxBackgroundColor = isDrawGraph ? '#e0f7fa' : '#f0f0f0'; // 옅은 파란색 또는 옅은 회색 배경
  const textColor = isDrawGraph ? 'blue' : 'gray'; // 파란색 또는 회색 텍스트
  const iconColor = isDrawGraph ? 'primary' : 'disabled'; // 파란색 또는 회색 아이콘

  return (
    <div
      style={{
        display: 'flex',
        padding: '0',
        width: '100%',
        height: '700px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            margin: '0 0 1rem 3rem',
          }}
        >
          {/* 모서리가 둥근 네모 박스 */}
          <Box
            sx={{
              display: 'flex',
              backgroundColor: boxBackgroundColor, // 배경색
              color: textColor, // 텍스트 색상
              padding: '10px 20px',
              borderRadius: '12px', // 모서리 둥글게
              width: '12rem',
            }}
          >
            {/* 아이콘과 텍스트 */}
            <FiberManualRecordIcon
              style={{ marginRight: '0.5rem' }}
              fontSize="small"
              color={iconColor}
            />
            <span>수업 중</span>
          </Box>
        </div>

        {/* --------------------------------------------------- 왼쪽 사이드 메뉴 -------------------------------------- */}
        {content ? (
          <>
            {/* 선생님이 준 테이블 */}
            <LeftTeacherAssignTable
              content={content}
              setDataCategory={setDataCategory}
            />
          </>
        ) : (
          <LeftSlidePage setDataCategory={setDataCategory} />
        )}

        {/* 사진 저장 리스트 */}
        <div style={{ margin: '0 3rem 20px 3rem' }}>
          <Typography variant="h5">사진 리스트</Typography>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: '12px',
              border: '1px solid lightgray',
              maxHeight: '200px', // 스크롤 활성화를 위한 높이 제한
              overflowY: 'auto', // 스크롤 활성화
            }}
          >
            <Table stickyHeader>
              {/* stickyHeader로 헤더 고정 */}
              <TableHead
                sx={{
                  backgroundColor: 'lightgray', // 헤더 배경색을 밝은 회색으로 설정
                }}
              >
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', padding: '6px 16px' }}>
                    제목
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 'bold', padding: '6px 16px' }}
                    align="right"
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {photoList.map((photo, index) => (
                  <TableRow
                    key={index}
                    style={{ height: '20px' }}
                    sx={{
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' }, // Hover 효과
                      transition: 'background-color 0.3s ease', // 부드러운 hover 전환
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        cursor: 'pointer',
                        color: 'black',
                        fontWeight: 'bold',
                        padding: '0 0 0 10px',
                      }}
                      onClick={() => handlePhotoClick(photo)}
                    >
                      {photo.title}
                    </TableCell>
                    <TableCell align="right" sx={{ padding: 0 }}>
                      <IconButton onClick={() => handleDeletePhoto(index)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {/* 기본적으로 3개의 빈 행 추가 */}
                {Array.from({ length: emptyRows }).map((_, idx) => (
                  <TableRow key={`empty-${idx}`} style={{ height: `20px` }}>
                    <TableCell colSpan={2} />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 저장 및 제출 버튼 추가 */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '20px',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ marginRight: '10px' }}
            >
              저장
            </Button>
            {isDrawGraph && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
              >
                제출
              </Button>
            )}
          </Box>
        </div>
      </div>

      {/* ---------------------------------------- 오른쪽 테이블 및 그래프 ----------------------------------------- */}
      <TableOrGraph dataCategory={dataCategory} setPhoto={handleAddPhoto} />

      {/* ---------------------------------------- 모달 -------------------------------------------------------*/}
      {selectedPhoto && (
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>{selectedPhoto.title}</DialogTitle>
          <DialogContent>
            <img
              src={selectedPhoto.image}
              alt={selectedPhoto.title}
              style={{ width: '100%', height: 'auto' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default DataInChartPage;
