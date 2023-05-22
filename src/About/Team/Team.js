import React, {  } from 'react';
import './Team.css';
import About1 from './Image/About1.png';
import About2 from './Image/About2.jpg';
import About3 from './Image/About3.jpg';

function Team(){
    return(
        <>
        <div className="container-fluid" id="con1">
           <h1>TEAM</h1>
        </div>
        <div className="container">
 <div className="row featurette" style={{ padding: '2em' }}>
        <div className="col-md-9 order-md-2">
          <h3 className="featurette-heading fw-normal lh-1">
           연구책임자 | 남윤경 <span className="text-muted"><br/>&nbsp;연구 총괄 책임</span>
          </h3>
          <ul className="lead">
            <li>지구과학교육과 부교수 </li>
            <li>Ph. D (University of Minnesota), 과학교육</li>
            <li>스마트 디바이스 활용 환경교육, STEM 교육, 과학-컴퓨팅 융합교육, 과학-공학 융합교육</li>
            <li>ynam@pusan.ac.kr</li>
            <li> 051) 510.2707 /  010. 4753. 1765</li>
          </ul>
        </div>
        <div className="col-md-3 order-md-1">
          
       
            <img src={About1} width="100%" />
            
          
        </div>
      </div>
      <hr className="featurette-divider"></hr>
      <div className="row featurette" style={{ padding: '2em' }}>
        <div className="col-md-9 order-md-2">
          <h3 className="featurette-heading fw-normal lh-1">
          연구원 |  윤진아 <span className="text-muted"><br/>&nbsp;교육 프로그램 담당</span>
          </h3>
          <ul className="lead">
            <li>부산대학교 과학교육연구소 전임연구원</li>
            <li>서울교육대학교 강의교수</li>
            <li>부산대학교 강의교수</li>
            <li>생물교육, 이학석사(생물학), 교육학 박사(영재교육)</li>
            <li>과학교육, 융합교육, 영재교육, 공학교육</li>
            <li>zinayoon@gmail.com</li>
            <li>010.4541.7741</li>
          </ul>
        </div>
        <div className="col-md-3 order-md-1">
        <img src={About2} width="100%" />
        </div>
      </div>
      <hr className="featurette-divider"></hr>
      <div className="row featurette" style={{ padding: '2em' }}>
        <div className="col-md-9 order-md-2">
          <h3 className="featurette-heading fw-normal lh-1">
          연구원 | 조운석<span className="text-muted"><br/>&nbsp;디바이스 개발 담당</span>
          </h3>
          <ul className="lead">
            <li>부산대학교 과학교육연구소 전임연구원 </li>
            <li>부산대학교 강의교수</li>
            <li>부산교육대학교 강의교수</li>
            <li>이학박사(생명과학)</li>
            <li>생태학, 하천생태학, 생태모델링, 과학교육</li>
            <li>woonseok.cho@gmail.com</li>
            <li>051)510.1877</li>
          </ul>
        </div>
        <div className="col-md-3 order-md-1">
        <img src={About3} width="100%" />
        </div>
      </div>
      <hr className="featurette-divider"></hr>
      <div className="row featurette" style={{ padding: '2em' }}>
        <div className="col-md-9 order-md-2">
          <h3 className="featurette-heading fw-normal lh-1">
            Content Box-Click Here <span className="text-muted">Sub-Title</span>
          </h3>
          <p className="lead">You can put some information here</p>
        </div>
        <div className="col-md-3 order-md-1">
          <svg
            className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
            width="270"
            height="270"
            xmlns="http://www.w3.org/2700/svg"
            role="img"
            aria-label="Placeholder:"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          >
            <title>Placeholder</title>
            <rect width="100%" height="100%" fill="#eee"></rect>
            
          </svg>
        </div>
      </div>
     
      </div>
        </>
    );
}
export default Team;