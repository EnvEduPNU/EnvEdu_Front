import './News.scss';
import { CiTrophy } from "react-icons/ci";

function News() {
  return (
    <>
      <div className="news">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className='team-circle'>
            <CiTrophy  size="50" color="#5e2ced" />
          </div>
          <h2 style={{ fontWeight: 'bold', margin: '1rem 0 5rem 0' }}>수상실적</h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className='award-list'>
            <div>
              <h2>2021</h2>
              <ul>
                <li>2021년 한국과학교육학회 하계학술대회 '우수논문상'</li>
              </ul>
            </div>

            <div>
              <h2>2020</h2>
              <ul>
                <li>2020년 제16회 대한민국 환경교육한마당 프로그램경진대회 '환경부 장관상'</li>
                <li>2020년 한국환경과학회 정기학술대회 '우수 구두발표상'</li>
                <li>2020년 한국컴퓨터교육학회 하계 학술대회 '우수논문상'</li>
              </ul>
            </div>

            <div>
              <h2>2019</h2>
              <ul>
                <li>2019년 한국공학교육학회 학술대회 '우수발표논문상'</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
          <iframe width="700" height="400" src="https://www.youtube.com/embed/G00ukY_Txls" allowfullscreen></iframe>
        </div>
      </div>

    </>
  );
} export default News;