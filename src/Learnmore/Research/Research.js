import '../News/News.scss';
import { IoNewspaperOutline } from "react-icons/io5";
import { FaPencilAlt } from "react-icons/fa";

function Research() {
  return (
    <>
      <div className="news">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className='team-circle'>
            <IoNewspaperOutline  size="45" color="#5e2ced" />
          </div>
          <h2 style={{ fontWeight: 'bold', margin: '1rem 0 5rem 0' }}>등재 논문</h2>
        </div>

        <div style={{ display: 'flex' }}>
          <div className='award-list'>
            <div>
              <h2>2023</h2>
              <ul>
                <li>Weon, J., & Nam, Y. (2023). 장소기반 학습이 중학교 학생들의 지속가능한 공원에대한 인식 및 환경 소양에 미치는 영향. 환경교육, 36(1), 17-34.</li>
                <li>이동영, 이효진, & 남윤경. (2023). 공학설계기반 오션클린업 (Ocean Clean-up) 수업이 STEAM 태도와 창의공학적 문제해결성향에 미치는 효과. 한국지구과학회지, 44(1), 79-89.</li>
              </ul>
            </div>
            <div>
              <h2>2022</h2>
              <ul>
                <li>이동영, & 남윤경. (2022). 창의공학적 문제해결성향에 기여한 과학-공학 융합수업의 특성. 대한지구과학교육학회지, 15(2), 285-298.</li>
                <li>이은지, & 남윤경. (2022). '미세먼지 없는 학교 위치 선정'Model Eliciting Activity (MEA) 수업이 고등학생들의 융합적 문제해결력과 환경소양에 미치는 영향. 현장과학교육, 16(2), 242-255.</li>
                <li>김주희, & 남윤경. (2022). 환경교육용 보드게임 디자인 활동이 고등학생들의 환경적 지식, 환경 소양과 창의 공학적 문제해결 성향에 미치는 영향. 한국환경교육학회 학술대회 자료집, 19-22.</li>
                <li>오승유, 조운석, & 남윤경. (2022). NetLogo 시뮬레이션 활동이 초등과학영재들의 생태계 개체군 상호작용에 대한 이해에 미치는 영향. 영재교육연구, 32(1), 1-17.</li>
              </ul>
            </div>
            <div>
              <h2>2021</h2>
              <ul>
                <li>윤진아, 이동영, 조운석, & 남윤경. (2021). 데이터 기반의 스마트 환경교육을 위한 교사연수 프로그램의 효과 분석. 교사교육연구, 60(4), 663-682.</li>
                <li>윤진아, 조운석, & 남윤경. (2021). 과학자의 사회적 역할과 책임에 대한 과학영재학생들의 인식. 영재교육연구, 31(3), 383-404.</li>
                <li>남윤경, 이동영, 강서영, & 윤진아. (2021). 중등학생을 위한 환경소양 검사 도구의 개발. 환경교육, 34(3), 319-337.</li>
                <li>남윤경. (2021). Urban Underrepresented Youths' Positive Experiences in an Informal Science Education Program. 교사교육연구, 60(3), 369-382.</li>
              </ul>
            </div>
            <div>
              <h2>2020</h2>
              <ul>
                <li>유예진, & 남윤경. (2020). 지역환경문제에 관한 사회과학쟁점 토론이 고등학교 학생들의 환경인식 변화에 미치는 영향. 대한지구과학교육학회지, 13(3), 284-296.</li>
                <li>이동영, 윤진아, & 남윤경. (2020). 융합적 문제해결력 검사 도구. 한국지구과학회지, 41(6), 670-683.</li>
                <li>이효진, & 남윤경. (2020). 과학· 공학 융합 수업의 중학교 현장적용을 위한 전문가 제안. 공학교육연구, 23(3), 20-31. [2020.12.]</li>
                <li>윤진아, 남윤경, & 조운석. (2020). 마이크로비트를 활용한 과학-SW 융합교육 프로그램 개발 및 적용. 컴퓨터교육학회 논문지, 23(6), 77-87. [2020.11.03]</li>
                <li>Nam, Y., Yoon, J., & Wieselmann, J. (2020, June). Gender Differences in Gifted Elementary Students' Decision-making About Renewable Energy: Social Relationships, Values, and Authority. In 2020 ASEE Virtual Annual Conference Content Access.</li>
                <li>윤진아, & 남윤경. (2020). 환경교육 활성화를 위한 과학과 교육과정과 환경과 교육과정 비교. 한국지구과학회지, 41(2), 155-175. [2020.4.27]</li>
              </ul>
            </div>
            <div>
              <h2>2019</h2>
              <ul>
                <li>이효진, & 남윤경. (2019). ‘빛’과 ‘소리’교육을 위한 공학설계 기반의 과학· 공학 융합프로그램 개발 및 적용. 현장과학교육, 13(3), 211-224. [2019.08]</li>
                <li>Nam, Y., & Chae, J. (2019). The Role of Science Knowledge Application in Improving Engineering Problem Solving Skills. 한국지구과학회지, 40(4), 436-445</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 학술대회 */}
      <div className="news" style={{ marginTop: '5rem'}}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className='team-circle'>
            <FaPencilAlt  size="35" color="#5e2ced" />
          </div>
          <h2 style={{ fontWeight: 'bold', margin: '1rem 0 5rem 0' }}>학술대회</h2>
        </div>

        <div style={{ display: 'flex' }}>
          <div className='award-list'>
            <div>
              <h2>2024</h2>
              <ul>
                <li>박주은, 문신혜, 남윤경. (2024). 사회적 배려 대상자 가족을 위한 학교 밖 과학교육 프로그램에서 나타난 부모와 자녀의 상호작용 분석. 2024 한국과학교육학회 동계학술대회.</li>
                <li>윤진아, 남윤경. (2024). 2022개정 과학과 교육과정에 나타난 데이터 기반 탐구활동 분석. 2024 한국과학교육학회 동계학술대회.</li>
                <li>이동영, 박애령, 황주현, 정주희, 남윤경. (2024). 고, 중, 고 2022 개정교육과정 과학과 성취기준 데이터 시각화 역량 범주 분석. 2024 한국과학교육학회 동계학술대회.</li>
                <li>전유현, 이동영, 남윤경. (2024). 데이터 시각화 역량 측정 도구 개발. 2024 한국과학교육학회 동계학술대회.</li>
                <li>이동영, 박애령, 황주현, 정주희, 남윤경. (2024). 데이터 시각화 역량 측면에서 2022 개정 교육과정 과학과 성취기준 분석. 2024 대한지구과학교육학회 동계학술대회.</li>
                <li>이동영, 전유현, 남윤경. (2024). 데이터 시각화 역량 측정 틀. 2024 대한지구과학교육학회 동계학술대회.</li>
              </ul>
            </div>

            <div>
              <h2>2023</h2>
              <ul>
                <li>윤진아, 남윤경. (2023). 실시간 온라인 학습을 위한 과학교사의 교수역량 프레임 워크. 2023 한국지구과학회 추계학술대회.</li>
                <li>이동영, 이효진, 남윤경. (2023) 공학설계를 활용한 오션클린업 수업이 STEM 태도와 창의적 공학문제해결 성향에 미치는 효과. 2023 KGU 추계학술대회.</li>
                <li>전유현,이동영,남윤경. (2023). 변인의 개수와 유형에 따른고등학생의 그래프 표상화 역량 평가. 2023 KGU 추계학술대회.</li>
                <li>윤진아, 남윤경. (2023). 에너지 관련 과학기술 사회쟁점(SSI)토론에서 나타난 초등과학영재들의 의사결정전략. 2023 한국지구과학회 춘계학술대회.</li>
                <li>원지운, 남윤경. (2023). 장소기반 학습이 중하교 학생들의 지속가능한 공원에 대한 인식 및 환경소양에 미치는 영향. 2023 한국지구과학회 춘계학술대회.</li>
                <li>이동영, 이효진, 남윤경. (2023). 공학설계를 활용한 오션클린업 수업이 STEM 태도와 창의적 공학문제해결 성향에 미치는 효과. 2023 대한지구과학교육협회 동계학술대회.</li>
                <li>남윤경. (2023). 교사를 위한 디지털 테크놀로지 역량. 2023 대한지구과학교육협회 동계학술대회.</li>
                <li>윤진아, 남윤경. (2023). 생태전환교육을 위한 교사연수 프로그램의 효과 분석. 2023 한국과학교육학회 동계학술대회.</li>
                <li>조운석, 윤진아, 노지화, 남윤경. (2023). 환경교육사의 디지털 테크놀로지 교수 역량 실태 조사. 2023 한국과학교육학회 동계학술대회.</li>
                <li>Younkyeong Nam, Eunjee Lee. (2023). Characteristics of High School Students’ Problem Solving in a Model Eliciting Activity (MEA) of Finding a Locations of Fine-Dust-Free School. ASTE(Association for Science Teacher Education) 학술대회.</li>
              </ul>
            </div>

            <div>
              <h2>2022</h2>
              <ul>
                <li>이동영, 남윤경. (2022). 과학/공학 융합 수업이 창의공학적 문제해결성향에 미치는 효과. 2022 한국지구과학회 추계학술대회.</li>
                <li>이동영, 남윤경. (2022). 공학설계를 적용한 과학수업이 초등학생의 창의성과 창의적 인성에 미치는 효과. 2022 대한지구과학교육학회 하계학술대회.</li>
                <li>이윤미, 윤진아, 남윤경. (2022). K-SDGs의 환경영역을 주제로 한 환경신문 기사 작성 활동 프로그램이 중학생들의 환경소양에 미치는 영향. 2022 한국환경교육학회 춘계학술대회.</li>
                <li>김주희, 남윤경. (2022). 환경교육용 보드게임 디자인 활동이 고등학생들의 환경적 지식, 환경 소양과 창의 공학적 문제해결 성향에 미치는 영향. 2022 한국환경교육학회 춘계학술대회.</li>
                <li>이은지, 남윤경. (2022). 미세먼지 MEA 활동 수업이 고등학생들의 문제해결 특성, 융합적 문제해결력, 환경소양에 미치는 영향. 2022 한국환경교육학회 춘계학술대회.</li>
                <li>윤진아, 이동영, 조운석, & 남윤경. (2022). 데이터 기반의 스마트 환경교육을 위한 교사연수 프로그램의 효과 분석. 2022 한국지구과학회 춘계학술대회.</li>
                <li>JinMong Shin, Younkyeong Nam. (2022). High School Girl's System Thinking Skills about the Carbon Cycle. 2022 ASTE(Association for Science Teacher Education) 학술대회.</li>
                <li>이동영, 남윤경. (2022). Elementary Student's Perception Changes about Their Creativity During Engineering Design Process. 2022 ASTE(Association for Science Teacher Education) 학술대회.</li>
                <li>Jina Yoon, Younkyeong Nam. (2022). A science teaching competency framework for online learning environment. 2022 ASTE(Association for Science Teacher Education) 학술대회.</li>
                <li>윤진아, 남윤경. (2022). 테크놀로지 교수내용지식(TPACK) 관점에서 바라본 예비과학교사들의 온라인 교육역량. 2022 한국과학교육학회 동계학술대회.</li>
                <li>조운석, 윤진아, 이동영, 남윤경. (2022). 환경 교육을 위한 스마트 환경 측정 시스템 개발. 2022 한국환경과학회 동계학술대회.</li>
              </ul>
            </div>

            <div>
              <h2>2021</h2>
              <ul>
                <li>이동영, 남윤경. (2021). Elementary Student's Perception Changes about Their Creativity During Engineering Design Process. 2021 한국과학교육학회 하계학술대회.</li>
                <li>윤진아, 조운석, 남윤경. (2021). 과학자의 사회적 역할과 책임에 대한 과학영재학생들의 인식. 2021 한국과학교육학회 하계학술대회.</li>
                <li>Jina Yoon, Younkyeong Nam. (2021). Science gifted students' perception of Scientists' Social Responsibility. 2021 EASE 2023 International Conference 하계학술대회.</li>
              </ul>
            </div>

            <div>
              <h2>2020</h2>
              <ul>
                <li>JinA Yoon, Younkyeong Nam.(2020). Gender Differences in Gifted Elementary Students’ Decision-Making about Renewable Energy: Social Relationships, Values, and Authority. 2020 ASEE Annual Conference(American Society for engineering Education).</li>
                <li>조운석, 노대일, 조성호, 윤진아, 남윤경. (2020). 환경 교육을 위한 스마트 환경 측정 시스템 개발. 2020년 환경과학회 정기학술대회. [우수 현장구두발표]</li>
                <li>윤진아. 남윤경. (2020). 마이크로비트를 활용한 과학-SW융합교육 프로그램 개발 및 적용. 2020 한국컴퓨터교육학회 하계 학술대회.[우수논문상]</li>
                <li>조운석, 노대일, 조성호, 윤진아, 남윤경. (2020). 환경 교육을 위한 스마트 환경 측정기기 및 어플리케이션 개발. 2020 대한지구과학교육학회 하계 학술대회.</li>
                <li>윤진아, 남윤경. (2020). 지속가능 발전을 위한 과학과 및 환경 교육과정 분석.  2020 대한지구과학교육학회 하계 학술대회.</li>
                <li>윤진아, 남윤경. (2020). 과학과 교육과정 분석을 통한 환경교육의 방향. 2020 한국과학교육학회 하계 학술대회.</li>
                <li>조운석, 노대일, 조성호, 윤진아, 남윤경. (2020). 아두이노 기반 환경 측정기기를 활용한 스마트 환경 교육 시스템 개발. 2020 한국과학교육학회 하계 학술대회.</li>
                <li>신진몽, 남윤경. (2020). 컴퓨터적 사고 기반지구 시스템 과학공학융합 수업. 2020 대한지구과학교육학회 하계 학술대회.</li>
                <li>신진몽, 남윤경. (2020).고등학교 여학생들의 이산화탄소 순환에 대한 지구시스템 사고 분석. 2020 한국지구과학회 하계학술대회. [2020.06.20]</li>
                <li>유예진, 남윤경.(2020). 도심 내 백로 서식지 문제에 대한 고등학교 학생들의 환경인식 변화 연구.   2020 한국지구과학회 하계학술대회. </li>
                <li>윤진아, 남윤경. (2020). 환경교육 활성화를 위한 과학과 교육과정과 환경 교육과정 비교. 2020 한국지구과학회 하계학술대회.</li>
                <li>남윤경, 이용섭, 김순식. (2020). 과학·공학 융합 수업 준거틀 및 공학 설계 수준 제안. 2020 한국지구과학회 하계학술대회.</li>
                <li>조운석, 노대일, 조성호, 윤진아, 남윤경. (2020).  스마트 환경 측정기기를 활용한 환경교육 시스템 개발.  2020 한국지구과학회 하계학술대회.  [2020.06. 20]</li>
                <li>조운석, 노대일, 조성호, 윤진아, 남윤경. (2020). 환경교육을 위한 아두이노 기반 스마트 환경 측정 시스템 개발. 한국컴퓨터교육학회 동계 학술대회. [2020.01.27.]</li>
                <li>남윤경, 이용섭, & 김순식. (2020). 한국과학 수업 상황을 고려한 과학⋅공학 융합 수업설계에 대한 제안. 2020 한국과학교육학회 학술대회.</li>
                <li>?. (2020). 공학설계 수업 후 성별에 따른 창의적 공학문제 해결 성향과 공학에 대한 인식 변화 차이. 2020 한국과학교육학회 학술대회.</li>
                <li>?. (2020). 과학⋅공학 융합 수업을 통해 창의적 공학문제해결 성향이 향상된 학생 사례분석. 2020 한국과학교육학회 학술대회.</li>
                <li>이동영, 남윤경. (2020). Developing and Implementing an Instrument for Measuring Creative Engineering Problems Solving Propensity. 2020 2020 ASTE(Association for Science Teacher Education).</li>
              </ul>
            </div>

            <div>
              <h2>2019</h2>
              <ul>
                <li>Younkyeong Nam, Ju-Won Kang,DongYoung Lee.(2019). Developing and Implementing an Instrument for Measuring Creative Engineering Problems Solving Propensity. 2019 ASTE-conference[미국 과학교사교육학회]</li>
                <li>공학 설계 기반 과학 융합수업의 현장 적용과 전문가 토의를 통한 개선점 제안. 2019 한국과학교육학회 동계 학술대회. [2019.12]</li>
                <li>이동영, 윤진아,남윤경. (2019). 융합적 문제 해결 성향(Integrative Problem Solving Propensity) 측정을 위한 검사지 개발. 2019 한국과학교육학회 하계 학술대회.</li>
                <li>남윤경,이효진,오승유. (2019). 과학·공학 융합 수업 평가틀 제안. 한국공학교육학회 하계학술대회. [2019.08.02][우수발표논문상]</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

    </>
  );
} export default Research;