import React, { useEffect, useState } from 'react';
import { getEClassDatas } from './api/eclass';
import LectureCardCarousel from './components/LectureCardCarousel';
import { useNavigate } from 'react-router-dom';

function ClassListPage() {
  const [classDatas, setClassDatas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const response = await getEClassDatas();
      console.log(response.data);

      setClassDatas(
        response.data
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .map((item, index) => ({
            uuid: item.uuid,
            index: index,
            thumbImg: item.thumbImg,
            stepName: item.stepName,
            username: item.username,
            timestamp: item.timestamp,
          })),
      );
    };
    getData();
  }, []);

  const navigateDetailClass = (uuid) => {
    navigate(`/modifyClass/${uuid}`);
  };

  //   const handleDeleteLecture = async (index, uuid, timestamp) => {
  //     try {
  //       await customAxios.delete(
  //         `/api/steps/deleteLectureContent/${uuid}/${timestamp}`,
  //       );
  //       const updatedLectures = [...lectureSummary];
  //       updatedLectures.splice(index, 1);
  //       setLectureSummary(updatedLectures);
  //       setLectureUuid(uuid);
  //       alert('E-Class가 성공적으로 삭제되었습니다.');
  //       window.location.reload();
  //     } catch (error) {
  //       console.error('Error deleting lecture:', error);
  //       alert('E-Class 삭제 중 오류가 발생했습니다.');
  //     }
  //   };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1
        style={{
          fontWeight: 600,
          fontSize: '48px',
        }}
      >
        E-CLASS 생성
      </h1>
      <div
        style={{
          display: 'flex',
          margin: '50px 0 0 0',
        }}
      >
        <LectureCardCarousel
          lectureSummary={classDatas}
          getLectureDataTable={navigateDetailClass}
          setClassDatas={setClassDatas}
        />
      </div>
      <div>
        <button
          style={{
            margin: '20px 0 50px 0',
            width: '900px',
            padding: '1rem 1rem',
            backgroundColor: '#FF9800', // 새로운 색상 (주황색)
            color: '#FFFFFF',
            borderRadius: '0.5rem',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
            outline: 'none',
            marginRight: '10px',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#FFA500'; // 마우스 오버 시 밝은 주황색
            e.target.style.transform = 'scale(1.05)'; // 확대 효과
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#FF9800'; // 기본 주황색
            e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
          }}
          onClick={() => {
            navigate('/createClass');
          }}
        >
          ECLASS 생성하기
        </button>
      </div>
    </div>
  );
}

export default ClassListPage;
