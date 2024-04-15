import './Training.scss';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import img1 from './Image/img1.jpg';
import img2 from './Image/img2.jpeg';
import img3 from './Image/img3.png';

import { FaChalkboardTeacher } from "react-icons/fa";

const CustomCard = styled.div`
  margin-right: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 20rem;
  height: 27rem;
  border-radius: 0.3125rem;
  cursor: pointer;
  transition : 0.5s;
  border: 1px solid #eeeeee;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  &:hover {
    transform: translateY(-20px);
  }
  h4 {
    font-size: 1.25em;
    margin-top: 1rem;
    font-weight: bold;
  }
  .card-list {
    margin-top: 0.5rem;
    width: 80%;
    line-height: 1.25rem;
    li {
      font-weight: bold;
      color: #626262;
    }
  }
`

const StartButton = styled.button`
  border: none;
  width: 7rem;
  border-radius: 0.3125rem;
  font-weight: bold;
  &:hover {
    background: #626262;
    color: #fff;
  }
`

function Training () {
    return  (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className='team-circle'>
              <FaChalkboardTeacher size="45" color="#5e2ced" />
          </div>
          <h2 style={{ fontWeight: 'bold', margin: '1rem 0 5rem 0' }}>연수</h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className='training-shortcut-container'>
            <CustomCard>
              <img src={img1}/>
              <h4>교사연수 (2020)</h4>
              <ul className='card-list'>
                <li>환경 교육에 대한 이해 및 교육과정 기반의 환경교육 프로그램 활용</li>
                <li>스마트 환경모니터링 킷의 현장 보급과 확산</li>
                <li>온라인 연수과정 및 현장연수 과정</li>
                <li>연수 자료 탑재</li>
              </ul>
              <div style={{ display: 'flex', justifyContent: 'end', width: '80%', marginBottom: '0.5rem' }}>
                <Link to="/training1">
                  <StartButton>자세히 보기</StartButton>
                </Link>
              </div>
            </CustomCard>

            <CustomCard>
              <img src={img2}/>
              <h4>교사연수 (2021)</h4>
              <ul className='card-list'>
                <li>환경교육의 현황</li>
                <li>환경교육과 첨단시스템의 활용</li>
                <li>스마트 디바이스의 교육적 활용</li>
                <li>환경 융합 교수-학습전략 (공학설계, MEA와 SSI)</li>
              </ul>
              <div style={{ display: 'flex', justifyContent: 'end', width: '80%', marginBottom: '0.5rem' }}>
                <Link to="/training2">
                  <StartButton>자세히 보기</StartButton>
                </Link>
              </div>
            </CustomCard>

            <CustomCard>
              <img src={img3}/>
              <h4>사회환경지도사 연수 (2020)</h4>
              <ul className='card-list'>
                <li>스마트 환경교육을 위한 디바이스 활용 교사 (온라인) 연수 현장</li>
                <li>스마트 환경교육을 위한 사회환경 지도사 연수 현장</li>
                <li>과학관 강사 및 해설사 교육 연수 현장</li>
              </ul>
              <div style={{ display: 'flex', justifyContent: 'end', width: '80%', marginBottom: '0.5rem' }}>
                <Link to="/training3">
                  <StartButton>자세히 보기</StartButton>
                </Link>
              </div>
            </CustomCard>
          </div>
        </div>
      </>
    );
}
export default Training;




































