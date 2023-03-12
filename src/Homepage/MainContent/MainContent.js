import './MainContent.css';
import home1 from './Image/home1.jpg';
import home2 from './Image/home2.jpg';
import home3 from './Image/home3.jpg';
import home4 from './Image/home4.jpg';


function ABC() {
  return (
    <>
    <div className="container">
      <div className="row" style={{ padding: '2em' }}>
        <div className="col-lg-4">
          <svg
            className="bd-placeholder-img rounded-circle "
            width="140"
            height="140"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Placeholder: 140x140"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          >
            <title>Placeholder</title>
            <rect width="100%" height="100%" fill="#777"></rect>
            <text x="50%" y="50%" fill="#777" dy=".3em">
              140x140
            </text>
          </svg>

          <h4 className="fw-normal">Information1</h4>
          <p>SEEd 프로그램 설명란입니다</p>
          <p>
            <a className="btn btn-secondary" href="#">
              View details »
            </a>
          </p>
        </div>
        <div className="col-lg-4">
          <svg
            className="bd-placeholder-img rounded-circle"
            width="140"
            height="140"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Placeholder: 140x140"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          >
            <title>Placeholder</title>
            <rect width="100%" height="100%" fill="#777"></rect>
            <text x="50%" y="50%" fill="#777" dy=".3em">
              140x140
            </text>
          </svg>

          <h4 className="fw-normal">Information2</h4>
          <p>SEEd 프로그램 설명란입니다</p>
          <p>
            <a className="btn btn-secondary" href="#">
              View details »
            </a>
          </p>
        </div>
        <div className=" col-lg-4">
          <svg
            className="bd-placeholder-img rounded-circle"
            width="140"
            height="140"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Placeholder: 140x140"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          >
            <title>Placeholder</title>
            <rect width="100%" height="100%" fill="#777"></rect>
            <text x="50%" y="50%" fill="#777" dy=".3em">
              140x140
            </text>
          </svg>

          <h4 className="fw-normal">Information3</h4>
          <p>SEEd 프로그램 설명란입니다</p>
          <p>
            <a className="btn btn-secondary" href="#">
              View details »
            </a>
          </p>
        </div>
      </div>
    </div>
      <div className="container">
      <hr className="featurette-divider"></hr>
      <div className="row featurette" style={{ padding: '2em' }}>
        <div className="col-md-7">
          <h4 className="featurette-heading fw-normal lh-1">
            <p>스마트 디바이스 </p><span className="text-muted"><p>스마트 디바이스의 특징과 교육적 활용방법을 확인해보세요.</p></span>
          </h4>
          
          <ul className="lead">
            <li>스마트 환경모니터링 킷(SEM Kit:Smart Environmental Monitering Kit)</li>
            <li>사용자 친화적인 측정도구</li>
            <li>간편한 환경지수 측정</li>
            <li>사용자 수준에 따른 측정데이터를 다양하게 표현 및 분석</li>
            <li>저렴하고 내구성이 있는 교육용 도구</li>
          </ul>
        </div>
        <div className="col-md-5">
        <img src={home1} width="100%"/>

        </div>
      </div>
      <hr className="featurette-divider"></hr>
      <div className="row featurette" style={{ padding: '2em' }}>
        <div className="col-md-7 order-md-2">
          <h4 className="featurette-heading fw-normal lh-1">
          교육 자료 (Educational Resource) <span className="text-muted"><p>풍부하고 공신력 있는 교육 자료를 확인해보세요.</p> </span>
          </h4>
          
          <ul className="lead">
            <li>스마트 환경측정 시스템의 교육적 활용	</li>
            <li>환경교육 교수학습 자료1[수권(Hydrosphere)에 대한 이해]</li>
            <li>환경교육 교수학습 자료2[기권(Atmosphere)에 대한 이해]</li>
            <li>환경교육 교수학습 자료3[지권(Geosphere)에 대한 이해]</li>
          </ul>
    
        </div>
        <div className="col-md-5 order-md-1">
          <img src={home2} width="100%"/>
        </div>
      </div>
      <hr className="featurette-divider"></hr>
      <div className="row featurette" style={{ padding: '2em' }}>
        <div className="col-md-7">
          <h4 className="featurette-heading fw-normal lh-1">
          교육자 연수 및 현장적용<br/>(Training & Implementation) <span className="text-muted"><p>환경교육 연수는 SEEd와 함께 하세요.
          
          </p></span>
          </h4>
          <ul className="lead">
             <li>스마트 환경 프로그램 소개</li>
             <li>스마트 환경측정 시스템 안내</li>
             <li>스마트 환경측정 시스템 활용 연수</li>
             <li>스마트 환경측정 시스템의 교육적 활용 안내</li>
          </ul>
        </div>
        <div className="col-md-5">
        <img src={home3} width="100%"/>
        </div>
      </div>
      <hr className="featurette-divider"></hr>
      <div className="row featurette" style={{ padding: '2em' }}>
        <div className="col-md-7 order-md-2">
          <h4 className="featurette-heading fw-normal lh-1">
          연구 및 소식 (Research & News)<span className="text-muted"></span>
          </h4>
          
          <ul className="lead">
            <li>등재 논문</li>
            <li>국제 학술 대회</li>
            <li>국내 학술 대회</li>
          </ul>
        </div>
        <div className="col-md-5 order-md-1">
        <img src={home4} width="100%"/>
        </div>
      </div>
      </div>
    </>
  );
}

export default ABC;
