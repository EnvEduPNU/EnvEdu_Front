import React, {  } from 'react';
import './Team.css';
import About1 from './Image/About1.png';
import About2 from './Image/About2.jpg';
import About3 from './Image/About3.jpg';
import About4 from './Image/About4.jpeg';


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
          외부참여 연구원 | 이동영<span className="text-muted"></span>
          </h3>
          <ul className="lead">
            <li>해원초등학교</li>
            <li>부산교육대학교 강의교수
            </li>
            <li>이학박사수료(지구과학), 교육학석사(영재교육)</li>
            <li>과학교육, 융합교육, STEM, Maker, 공학교육</li>
            <li>shainare00@hanmail.net</li>
            <li>051)510.1642</li>
          </ul>
        </div>
        <div className="col-md-3 order-md-1">
        <img src={About4} width="100%"/>
        </div>
      </div>

      
     
      </div>
        </>
    );
}
export default Team;

