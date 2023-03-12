import React, { Component } from 'react';
import './What.css';
import what1 from "./Image/what1.png";
import what2 from "./Image/what2.png";
import what3 from "./Image/what3.png";
import what4 from "./Image/what4.png";
import what5 from "./Image/what5.png";


function What(){
    return(
        <>
        <div className="container-fluid" id="con1">
           <h1>What We Do</h1>
        </div>
        
        <div className="container" id="con2">
            
            <div className="box">
            <h4>사용자 친화적 스마트 환경모니터링 도구 개발과 이를 활용한 환경 교육 프로그램의 효과 분석</h4><hr/>
            <p>세계적으로 지속가능한 미래를 위한 교육으로 환경 교육의 중요성이 강조되고 있다. 그러나 환경 문제의 심각성에 비해 우리나라 교육과정에서 환경교육에 두는 비중은 매우 미미하다. 환경 교육의 효율을 위해서는 무엇보다 주요 환경지수를 한 번에 간편하게 측정하고 각 지수간의 관계를 바로 분석 할 수 있는 저렴하고 사용자 친화적인 측정도구가 절실하다.
            <br/><br/>본 연구에서는 피지컬 컴퓨팅과 스마트 디바이스 어플리케이션을 통해 간편한 환경지수 측정뿐 아니라 사용자 수준에 따라 측정데이터를 다양하게 표현하고 분석할 수 있는 저렴하고 내구성이 있는 사용자 친화적 스마트 환경 모니터링 킷(SEM Kit)을 개발하였다. 이를 통해 환경 측정 및 모니터링 기반 환경교육 프로그램에서 활용 가능한 환경측정 시스템을 개발하여 보급하고자 한다.</p>
            </div><br/>
            <div className="box">
                <h4>1.사용자 친화적인(user-friendly) 스마트 환경모니터링 킷(SEM Kit) 개발</h4><hr/>
                <p>피지컬 컴퓨팅기술과 스마트 디바이스를 활용한 사용자 친화적 환경모니터링 키트(SEM Kit)를 개발</p>
             
        <div className="row featurette" style={{ padding: '2em' }}>
        <div className="col-md-7 order-md-2">
            <br/>
          <h5 className="featurette-heading fw-normal lh-1">
          <b>사용자 친화적인 스마트 환경모니터링 킷(SEM Kit) 개발 </b><span className="text-muted"></span>
          </h5>
          <ul className="lead">
            <li>피지컬 컴퓨팅과 스마트 디바이스 어플리케이션을 통해 간편한 환경지수 측정</li>

            <li>사용자 수준에 따라 측정데이터를 다양하게 표현하고 분석가능</li>

            <li>저렴하고 내구성이 있는 사용자 친화적 스마트 환경 모니터링 킷(SEM Kit) 개발</li>
          </ul>
        </div>
        <div className="col-md-5 order-md-1">
          <img src={what1} width="100%"/>
           
        </div>
        </div>
        <hr className="featurette-divider"></hr>
      <div className="row featurette" style={{ padding: '2em' }}>
        <div className="col-md-7 order-md-2">
          <h5 className="featurette-heading fw-normal lh-1">
          <br/>
         <b> 지역생태 환경 데이터 예비 수집 및 분석을 통한 스마트 환경모니터링 킷(SEM Kit) 보완</b>
 <span className="text-muted"></span>
          </h5>
          <ul className="lead">
              <li>개발된 SEM Kit을 예비 적용하여 지역 생태환경 지수를 측정, 분석</li>
              <li>SEM Kit의 내구성과 사용자 친화성을 고려하여 3D프린터로 외부 디자인을 설계, 적용</li>
              <li>연동되는 스마트 디바이스와의 네트워크 효율성을 최대한 증가</li>
          </ul>
        </div>
        <div className="col-md-5 order-md-1">
         <img src={what2} width="100%"/>
        </div>
        </div>
            </div>
            <br></br><h4>2. 스마트 환경교육 프로그램자료와 온라인 코스웨어 개발</h4><hr/>
                <h6>대상자별 스마트 환경교육 역량 선정 및 대상자별 스마트 환경교육 프로그램 개발  및 교육역량 연결</h6>
            <div className="box" id="box2">
            <div className="what2">
            <img src={what3} width="100%"/>
            </div>
                <p>	<br/><br/>
                    1) 환경지식 역량: 핵심적 지식 기반[ 2015개정교육과정과 선진국의 환경교육기초 자료 분석 기반 학교 급별 핵심적 지식 교육<br/><br/>
                    2) 시스템 사고역량: 이원론적 사고에서 시스템 사고로[환경에 대한 시스템적 이해, 다변인 상호작용, 시스템구조 모두 고려<br/><br/>
                    3) 융합적 문제해결역량: 다양한 측면에서 창의적인 문제해결[창의적 해결책 설계와 효율적 실행, 비판적 평가와 의사소통 및 협업<br/><br/>
                    4) 합리적 의사소통과 실천역량: 환경적 소양을 갖춘 능동적 시민</p>
            <br/><br/>            
            <h5> <b>대상자별 스마트 환경교육 프로그램 개발 및  세부 학습 주제 와 교육역량 연결</b></h5>
            <ul><br/>
                <li>시스템 사고 향상을 위한 다변인 데이터 분석 : 엑셀프로그램, GLOBE(globe.gov)와 NASA교육용 데이터, Google Earth 활용,  지역수준에서 글로벌 수준까지 이해</li><br/>
                <li>융합적 문제해결력 향상을 위한 융합적 탐구와 공학적 문제해결 활동 : 공학적설계(engineering desing)요소를 통한 환경문제의 실제적 해결을 경험</li><br/>
                <li>의사결정과 실천적 역량을 위한 사회-과학적 문제(SSI) 토론 : 환경문제를 사회, 경제, 문화, 정치 등 다양한 측면에서 조망,  SSI토론으로 환경에 대한 윤리, 책임의식, 논리적 추론</li>
            </ul>
            <div className="what4">
            <img  src={what4} width="100%"/>
            </div>
            </div><br/><br/>
            <h4>3. 스마트 환경교육 효과 검증도구 개발 및 대상자별 적용</h4><hr/>
  
            <div className="box">
              <ul>
                <li>스마트 환경 교육 효과 평가 도구 개발 및 타당도 신뢰도 검증</li><br/>
                <li> 스마트 환경교육 프로그램 대상자별 적용 및 효과 검증 : 환경적 핵심역량에 근거한 신뢰롭고 타당한 평가 도구 보급</li><br/>
                <li>시민지도사 및 환경 교사 재교육 프로그램 확산 방안:  교육 및 지도사 양성을  통한 스마트 환경 교육의 신속한 학교 현장화</li><br/>
              </ul>

            <img src={what5} width="100%"></img>
                
            </div><br/>

            <h4>4. 기대효과</h4><hr/>
            <div className="box">
              <ul>
              <li><b> 경제적이고 효율적인 사용자 친화적 환경모니터링 킷(SEM Kit) 개발</b><br/>
지식위주의 학교 환경교육을 과학적 탐구와 체험으로, 저예산으로 운영되는 학교 밖 환경교육의 전문성 신장과 활성화에 기여</li><br/>

<li> <b>미래 환경 인재 양성을 위한 체계적인 교육 프로그램 개발 및 보급</b><br/>
SEM Kit을 활용한 스마트 환경교육 프로그램의 개발과 보급은 환경교육의 활성화를 통해 미래 환경 인재 양성에 기여</li><br/>

<li> <b>환경적 핵심역량에 근거한 신뢰롭고 타당한 평가 도구 보급</b><br/>
학교 환경 교육과 학교 밖 환경교육의 효과를 체계적으로 평가하고 환경교육의 타당성을 확보하기 위한 근거를 제공</li><br/>

<li> <b>환경교사 재교육과 시민지도사 양성을 스마트 환경 교육의 신속한 학교 현장화</b><br/>
e-training과 교사연수 및 워크샵을 통해 교사 전문성을 향상, 온라인 코스웨어와 환경교육 박람회를 통해 학교환경교육과 환경단체의 소통의 장을 제공, 환경교육의 신속한 학교 현장화에 기여</li><br/><br/>
</ul>
            </div>
     
            
            

        </div>

        </>
    );
}
export default What;
