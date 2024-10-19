import React, { useState, useEffect } from 'react';
import './OpenApi.scss';
import { Link } from 'react-router-dom';
import earthImg from './earth.png';
import Water from './water';
import Air from './air';
import BackwardButton from '../SEEdApp/button/BackwardButton';

export default function OpenApi() {
  const [category, setCategory] = useState('water');
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const username = localStorage.getItem('username');

    if (!username) {
      alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      window.location.href = '/login'; // 로그인 페이지로 이동
    } else {
      setIsLoading(false); // 로그인 확인이 완료되면 로딩 상태 해제
    }
  }, []);

  // 선택한 카테고리에 따라 스타일을 동적으로 설정하는 함수
  const changeStyle = (selectedCategory) => {
    return {
      backgroundColor: category === selectedCategory ? '#FFF' : '#027c2b',
      color: category === selectedCategory ? '#027c2b' : '#fff',
      border: category === selectedCategory ? '2px solid #027c2b' : 'none',
    };
  };

  // 로딩 중일 때는 로딩 화면을 보여줌
  if (isLoading) {
    return <div>로딩 중...</div>; // 로딩 중 메시지 표시
  }

  return (
    <div id="wrap-openapi-div">
      <div style={{ margin: '1vh 4vh' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h3 className="air-div-full">
            <img
              src={earthImg}
              style={{
                width: '10%',
                marginRight: '0.625rem',
              }}
            />
            {category === 'water' && '수질 데이터 조회'}
            {category === 'air' && (
              <>
                대기질 데이터 조회
                <img
                  src="/assets/img/question.png"
                  style={{
                    marginLeft: '1rem',
                    marginRight: '0.3rem',
                    width: '1rem',
                    height: '1rem',
                  }}
                />
              </>
            )}
          </h3>
          <div style={{ marginTop: '10px' }}>
            <BackwardButton buttonName={'뒤로가기'} />
            <span>
              <Link
                to={'/search'}
                style={{ color: '#aaa', fontSize: '1rem', margin: '0 2.5vh' }}
              >
                다른 지역의 측정소 조회하기
              </Link>
            </span>
          </div>
        </div>

        <div className="wrap-select-type">
          <div
            className="select-type"
            onClick={() => setCategory('water')}
            style={changeStyle('water')}
          >
            수질 데이터
          </div>
          <div
            className="select-type"
            onClick={() => setCategory('air')}
            style={changeStyle('air')}
          >
            대기질 데이터
          </div>
        </div>
      </div>
      {category === 'water' && <Water />}
      {category === 'air' && <Air />}
    </div>
  );
}
