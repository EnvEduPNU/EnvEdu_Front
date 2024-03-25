import React from "react";
import "./Home.scss";
import Carousel from "react-bootstrap/Carousel";
import styled from "styled-components";
import { Link } from "react-router-dom";

import cardImg1 from "./Image/card1.jpg";
import cardImg2 from "./Image/card2.jpg";
import cardImg3 from "./Image/card3.jpg";
import cardImg4 from "./Image/card4.jpg";

import { IoHardwareChip } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaChalkboardTeacher } from "react-icons/fa";
import { GiArchiveResearch } from "react-icons/gi";

const CustomCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 20rem;
  height: 25rem;
  border-radius: 0.3125rem;
  cursor: pointer;
  transition: 0.5s;
  border: 1px solid #eeeeee;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  &:hover {
    transform: translateY(-20px);
  }
  h4 {
    margin-top: 1rem;
    font-weight: bold;
  }
  span {
    width: 80%;
    font-weight: bold;
    color: #626262;
  }
`;

const StartButton = styled.button`
  border: none;
  width: 6rem;
  border-radius: 0.3125rem;
  font-weight: bold;
  &:hover {
    background: #626262;
    color: #fff;
  }
`;

export default function Home() {
  return (
    <>
      <Carousel className="carousel">
        <Carousel.Item interval={6000}>
          <div className="carousel-img item1">
            <h2>SEEd는 어떤 플랫폼인가요?</h2>
            <div className="typing-container">
              SEEd는 환경 데이터 측정 및 그래프 그리기, 온라인 클래스 생성을
              지원하는 플랫폼이에요.{" "}
            </div>
            <Link to="/">
              <button
                className="detail-button"
                style={{ animationDelay: "5s" }}
              >
                자세히 보기
              </button>
            </Link>
          </div>
        </Carousel.Item>

        <Carousel.Item interval={6000}>
          <div className="carousel-img item2">
            <h2>어떤 연구를 진행했는지 궁금해요!</h2>
            <div className="text-container">
              스마트 환경 모니터링 Kit, 환경 교육 프로그램 자료 및 온라인
              코스웨어를 개발했어요. <br />
              자세한 내용은 아래 링크에서 볼 수 있어요.
            </div>
            <Link to="/what">
              <button
                className="detail-button"
                style={{ animationDelay: "1.5s" }}
              >
                자세히 보기
              </button>
            </Link>
          </div>
        </Carousel.Item>
      </Carousel>

      <div className="shortcut-container">
        <CustomCard>
          <img src={cardImg1} />
          <h4>SEEd App</h4>
          <span>
            SEEd 측정 기기로 습도, 이산화탄소, 조도 등 다양한 값을 측정할 수
            있어요.
          </span>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              width: "80%",
              marginTop: "1rem",
            }}
          >
            <Link to="/socket">
              <StartButton>START</StartButton>
            </Link>
          </div>
        </CustomCard>

        <CustomCard>
          <img src={cardImg2} />
          <h4>Data & Chart</h4>
          <span>
            SEEd App으로 측정한 값을 바탕으로 그래프를 그릴 수 있어요.
          </span>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              width: "80%",
              marginTop: "1rem",
            }}
          >
            <Link to="/data-in-chart">
              <StartButton>START</StartButton>
            </Link>
          </div>
        </CustomCard>

        <CustomCard>
          <img src={cardImg3} />
          <h4>E-class</h4>
          <span>환경 데이터 수업을 설계하고 수강할 수 있어요.</span>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              width: "80%",
              marginTop: "1rem",
            }}
          >
            <Link to="/E-classes">
              <StartButton>START</StartButton>
            </Link>
          </div>
        </CustomCard>

        <CustomCard>
          <img src={cardImg4} />
          <h4>Data Literacy</h4>
          <span>
            데이터를 읽고 그 안에 숨겨진 의미를 파악하는 활동을 할 수 있어요.
          </span>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              width: "80%",
              marginTop: "1rem",
            }}
          >
            <Link to="/dataLiteracy/dataLoad">
              <StartButton>START</StartButton>
            </Link>
          </div>
        </CustomCard>
      </div>

      <div className="info-container">
        <div className="section">
          <IoHardwareChip size="50" color="#F38181" />
          <h3 className="section-title">스마트 디바이스</h3>
          <hr />
          <ul className="section-description">
            <li>스마트 환경모니터링 킷(SEM Kit)</li>
            <li>사용자 친화적인 측정 도구</li>
            <li>간편한 환경지수 측정</li>
            <li>사용자 수준에 따른 측정데이터를 다양하게 표현 및 분석</li>
            <li>저렴하고 내구성이 있는 교육용 도구</li>
          </ul>
        </div>

        <div className="section">
          <IoDocumentTextOutline size="50" color="#FCE38A" />
          <h3 className="section-title">교육 자료</h3>
          <hr />
          <ul className="section-description">
            <li>환경교육 교수학습 자료1[수권(Hydrosphere)에 대한 이해]</li>
            <li>환경교육 교수학습 자료2[기권(Atmosphere)에 대한 이해]</li>
            <li>환경교육 교수학습 자료3[지권(Geosphere)에 대한 이해]</li>
          </ul>
        </div>

        <div className="section">
          <FaChalkboardTeacher size="50" color="#EAFFD0" />
          <h3 className="section-title">교육자 연수 및 현장적용</h3>
          <hr />
          <ul className="section-description">
            <li>스마트 환경 프로그램 소개</li>
            <li>스마트 환경측정 시스템 안내</li>
            <li>스마트 환경측정 시스템 활용 연수</li>
            <li>스마트 환경측정 시스템의 교육적 활용 안내</li>
          </ul>
        </div>

        <div className="section">
          <GiArchiveResearch size="50" color="#95E1D3" />
          <h3 className="section-title">연구 및 소식</h3>
          <hr />
          <ul className="section-description">
            <li>등재 논문</li>
            <li>국제 학술 대회</li>
            <li>국내 학술 대회</li>
          </ul>
        </div>
      </div>
    </>
  );
}
