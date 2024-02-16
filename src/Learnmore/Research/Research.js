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
              <h2>2020</h2>
              <ul>
                <li>이효진, & 남윤경. (2020). 과학· 공학 융합 수업의 중학교 현장적용을 위한 전문가 제안. 공학교육연구, 23(3), 20-31. [2020.12.]</li>
                <li>윤진아, 남윤경, & 조운석. (2020). 마이크로비트를 활용한 과학-SW 융합교육 프로그램 개발 및 적용. 컴퓨터교육학회 논문지, 23(6), 77-87. [2020.11.03]</li>
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
              <h2>2020</h2>
              <ul>
                <li>JinA Yoon, Younkyeong Nam.(2020). Gender Differences in Gifted Elementary Students’ Decision-Making about Renewable Energy: Social Relationships, Values, and Authority. 2020 ASEE Annual Conference(American Society for engineering Education).</li>
                <li>조운석, 노대일, 조성호, 윤진아, 남윤경. (2020). 환경 교육을 위한 스마트 환경 측정 시스템 개발. 2020년 환경과학회 정기학술대회. [우수 현장구두발표]</li>
                <li>윤진아. 남윤경. (2020). 마이크로비트를 활용한 과학-SW융합교육 프로그램 개발 및 적용. 2020 한국컴퓨터교육학회 하계 학술대회.[우수논문상]</li>
                <li>조운석, 노대일, 조성호, 윤진아, 남윤경. (2020). 환경 교육을 위한 스마트 환경 측정기기 및 어플리케이션 개발. 2020 대한지구과학교육학회 하계 학술대회.</li>
                <li>조운석, 노대일, 조성호, 윤진아, 남윤경. (2020). 환경 교육을 위한 스마트 환경 측정기기 및 어플리케이션 개발. 2020 대한지구과학교육학회 하계 학술대회.</li>
                <li>윤진아, 남윤경. (2020). 과학과 교육과정 분석을 통한 환경교육의 방향. 2020 한국과학교육학회 하계 학술대회.</li>
                <li>조운석, 노대일, 조성호, 윤진아, 남윤경. (2020). 아두이노 기반 환경 측정기기를 활용한 스마트 환경 교육 시스템 개발. 2020 한국과학교육학회 하계 학술대회.</li>
              </ul>
            </div>

            <div>
              <h2>2019</h2>
              <ul>
                <li>Younkyeong Nam, Ju-Won Kang,DongYoung Lee.(2019). Developing and Implementing an Instrument for Measuring Creative Engineering Problems Solving Propensity. 2019 ASTE-conference[미국 과학교사교육학회]</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

    </>
  );
} export default Research;