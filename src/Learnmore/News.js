import './News.css';
import news1 from './Image/news1.png';
import news2 from './Image/news2.png';
import news3 from './Image/news3.jpg';
import news4 from './Image/news4.jpg';
import news5 from './Image/news5.jpg';
import news6 from './Image/news6.jpg';
import news7 from './Image/news7.jpg';
import news8 from './Image/news8.jpg';


function News(){
    return(
        <>
             <div className="container-fluid" id="con1">
             <h1>News & Reserch</h1>
            </div>

            <div className="container">
                <h2><b>수상실적</b></h2><hr/>

                <div className="row featurette" style={{ padding: '2em' }}>
                 <div className="col-md-7 order-md-2">
                <h3 className="featurette-heading fw-normal lh-1">
                 <span className="text-muted"></span>
                 </h3><br/>
          <ul className="lead">
            <li>2020년 제16회 대한민국 환경교육한마당 프로그램경진대회 <b>[환경부 장관상]</b> </li>
            <li>2020년 환경과학회 정기학술대회  <b>[우수 현장구두발표] </b></li>
            <li>2020 한국컴퓨터교육학회 하계 학술대회 <b> [우수논문상]</b></li>
            <li>2019년  한국공학교육학회 학술대회 <b>[우수발표논문상]</b> </li>

          </ul>
        </div>
        <div className="col-md-5 order-md-1">
        <iframe width="464" height="314" src="https://www.youtube.com/embed/G00ukY_Txls" title="[프로그램 경진대회] 스마트 디바이스를 활용한 환경 교육 프로그램 개발 및  적용   SEED Smart Environmental  Education master" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
            </div>

           <div className="container-fluid" id="photo">      
                <div className="photo">             
                    <img className="col-md-2 " src={news1} width="30%"/>
                    <img className="col-md-2 "src={news2} width="30%"/>
                    <img className="col-md-2 "src={news3} width="30%"/>
                    <img className="col-md-2 "src={news4} width="30%"/>
                </div>
          </div>

          <div className="container"><br/>
                <h2><b>등재논문</b></h2><hr/>

                <div className="row featurette" style={{ padding: '2em' }}>
                 <div className="col-md-7 order-md-2">
                <h3 className="featurette-heading fw-normal lh-1">
                 <span className="text-muted"></span>
                 </h3><br/>
          <ul className="lead2">
            <li>이효진, & 남윤경. (2020). 과학· 공학 융합 수업의 중학교 현장적용을 위한 전문가 제안. 공학교육연구, 23(3), 20-31. [2020.12.]</li>
            <li>윤진아, 남윤경, & 조운석. (2020). 마이크로비트를 활용한 과학-SW 융합교육 프로그램 개발 및 적용. 컴퓨터교육학회 논문지, 23(6), 77-87. [2020.11.03] </li>
            <li>윤진아, & 남윤경. (2020). 환경교육 활성화를 위한 과학과 교육과정과 환경과 교육과정 비교. 한국지구과학회지, 41(2), 155-175. [2020.4.27]</li>
            <li>이효진, & 남윤경. (2019). ‘빛’과 ‘소리’교육을 위한 공학설계 기반의 과학· 공학 융합프로그램 개발 및 적용. 현장과학교육, 13(3), 211-224. [2019.08]</li>
            <li>Nam, Y., & Chae, J. (2019). The Role of Science Knowledge Application in Improving Engineering Problem Solving Skills. 한국지구과학회지, 40(4), 436-445</li>

          </ul>
        </div>
        <div className="col-md-5 order-md-1">
        <img src={news5} width="100%"/>
        </div>
      </div>
            </div>

            <div className="container"><br/>
                <h2><b>학술대회</b></h2><hr/>

                <div className="row featurette" style={{ padding: '2em' }}>
                 <div className="col-md-7 order-md-2">
                <h3 className="featurette-heading fw-normal lh-1">
                 <span className="text-muted"></span>
                 </h3><br/>
          <ul className="lead2">
            <h4>국제학술대회</h4><br/>
            <li>JinA Yoon, Younkyeong Nam.(2020). Gender Differences in Gifted Elementary Students’ Decision-Making about Renewable Energy: Social Relationships, Values, and Authority. 2020 ASEE Annual Conference(American Society for engineering Education).</li>
            <li>Younkyeong Nam, Ju-Won Kang,DongYoung Lee.(2019). Developing and Implementing an Instrument for Measuring Creative Engineering Problems Solving Propensity. 2019 ASTE-conference[미국 과학교사교육학회]</li>


          </ul>
        </div>
        <div className="col-md-5 order-md-1">
        <img className="news6" src={news6} width="100%"/>
        </div>
      </div>
      
      <div className="row featurette" style={{ padding: '2em' }}>
                 <div className="col-md-7 order-md-2">
                <h3 className="featurette-heading fw-normal lh-1">
                 <span className="text-muted"></span>
                 </h3><br/>
          <ul className="lead2">
            <h4>국내학술대회</h4><br/>
            <li>조운석, 노대일, 조성호, 윤진아, 남윤경. (2020). 환경 교육을 위한 스마트 환경 측정 시스템 개발. 2020년 환경과학회 정기학술대회. [우수 현장구두발표] </li>
            <li>윤진아. 남윤경. (2020). 마이크로비트를 활용한 과학-SW융합교육 프로그램 개발 및 적용. 2020 한국컴퓨터교육학회 하계 학술대회.[우수논문상]</li>
            <li>조운석, 노대일, 조성호, 윤진아, 남윤경. (2020). 환경 교육을 위한 스마트 환경 측정기기 및 어플리케이션 개발. 2020 대한지구과학교육학회 하계 학술대회. </li>
            <li>조운석, 노대일, 조성호, 윤진아, 남윤경. (2020). 환경 교육을 위한 스마트 환경 측정기기 및 어플리케이션 개발. 2020 대한지구과학교육학회 하계 학술대회. </li>
            <li>윤진아, 남윤경. (2020). 과학과 교육과정 분석을 통한 환경교육의 방향. 2020 한국과학교육학회 하계 학술대회. </li>
            <li>조운석, 노대일, 조성호, 윤진아, 남윤경. (2020). 아두이노 기반 환경 측정기기를 활용한 스마트 환경 교육 시스템 개발.   2020 한국과학교육학회 하계 학술대회. </li>
            <li>신진몽, 남윤경. (2020). 컴퓨터적 사고 기반지구 시스템 과학공학융합 수업. 2020 대한지구과학교육학회 하계 학술대회.</li>
            <li> 신진몽, 남윤경. (2020).고등학교 여학생들의 이산화탄소 순환에 대한 지구시스템 사고 분석. 2020 한국지구과학회 하계학술대회. [2020.0620]</li>
            <li>유예진, 남윤경.(2020). 도심 내 백로 서식지 문제에 대한 고등학교 학생들의 환경인식 변화 연구.   2020 한국지구과학회 하계학술대회. </li>
            <li> 윤진아, 남윤경. (2020). 환경교육 활성화를 위한 과학과 교육과정과 환경 교육과정 비교. 2020 한국지구과학회 하계학술대회..</li>
            <li>남윤경, 이용섭, 김순식. (2020). 과학·공학 융합 수업 준거틀 및 공학 설계 수준 제안. 2020 한국지구과학회 하계학술대회.</li>
            <li>조운석, 노대일, 조성호, 윤진아, 남윤경. (2020).  스마트 환경 측정기기를 활용한 환경교육 시스템 개발.  2020 한국지구과학회 하계학술대회.  [2020.06. 20]</li>
            <li>조운석, 노대일, 조성호, 윤진아, 남윤경. (2020). 환경교육을 위한 아두이노 기반 스마트 환경 측정 시스템 개발. 한국컴퓨터교육학회 동계 학술대회. [2020.01.27.]</li>
            <li>공학 설계 기반 과학 융합수업의 현장 적용과 전문가 토의를 통한 개선점 제안. 2019 한국과학교육학회 동계 학술대회. [2019.12]</li>
            <li>이동영, 윤진아,남윤경. (2019). 융합적 문제 해결 성향(Integrative Problem Solving Propensity) 측정을 위한 검사지 개발. 2019 한국과학교육학회 하계 학술대회.</li>
            <li>남윤경,이효진,오승유. (2019). 과학·공학 융합 수업 평가틀 제안. 한국공학교육학회 하계학술대회. [2019.08.02][우수발표논문상]</li>
            
          </ul>
        </div>
        <div className="col-md-5 order-md-1" id="pic">
        <img src={news7} width="100%"/>
        <img src={news8} width="100%"/>
        </div>
      </div>
            </div>
            
        </>
    );
}export default News;