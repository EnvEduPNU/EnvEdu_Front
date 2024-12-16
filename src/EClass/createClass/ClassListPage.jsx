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

  const navigateDetailClass = (uuid, timestamp) => {
    navigate(`/modifyClass/${uuid}/${timestamp}`);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
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
        <button
          onClick={() => {
            navigate('/EClassLivePage');
          }}
          style={{
            marginLeft: '30px',
            padding: '3px 5px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: '1px solid #007BFF',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#0056b3';
            e.target.style.borderColor = '#0056b3';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#007BFF';
            e.target.style.borderColor = '#007BFF';
          }}
        >
          뒤로가기
        </button>
      </div>

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
