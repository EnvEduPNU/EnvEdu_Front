import './Team.scss';
import { AiOutlineTeam } from "react-icons/ai";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import About1 from './Image/About1.png';
import About2 from './Image/About2.jpg';
import About3 from './Image/About3.jpg';
import About4 from './Image/About4.jpeg';

const Card = ({ img, name, position, profile, email, call }) => {
  return (
    <div class="card">
      <div class="card-front">
        <div style={{ marginBottom: '1rem' }}>
          <img src={img} />
        </div>
        
        <h4 style={{ fontWeight: 'bold' }}>{name}</h4>
        <span style={{ color: '#1f1f1f99' }}>{position}</span>

        <div style={{ color: '#1f1f1f99', marginTop: '2rem', fontSize: '0.75em' }}>
          <MdOutlineEmail size="15" color="#5e2ced" style={{ marginRight: '0.5rem' }} />
          {email}
        </div>
        <div style={{ color: '#1f1f1f99', fontSize: '0.75em', marginTop: '0.3rem' }}>
          <FaPhoneAlt size="12" color="#5e2ced"style={{ marginRight: '0.5rem' }} />
          {call}
        </div>
        
      </div>
      <div class="card-back">{profile}</div>
    </div>
  )
}
export default function Team() {
  return(
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className='team-circle'>
          <AiOutlineTeam size="50" color="#5e2ced" />
        </div>
        <h2 style={{ fontFamily: 'Poppins', fontWeight: 'bold', margin: '1rem 0 5rem 0' }}>Our Team</h2>
      </div>

      <div className="team">
        <Card 
          img={About1}
          name="남윤경"
          position="연구 총괄 책임"
          profile={
            <>
            지구과학교육과 교수
            <br />
            Ph. D (University of Minnesota), 과학교육
            <br />
            스마트 디바이스 활용 환경교육, STEM 교육, 과학-컴퓨팅 융합교육, 과학-공학 융합교육
            </>
          }
          email="ynam@pusan.ac.kr"
          call="051)510-2707"
        />

        <Card 
          img={About2}
          name="윤진아"
          position="교육 프로그램 담당"
          profile={
            <>
            부산대학교 과학교육연구소 전임연구원
            <br />
            서울교육대학교 강의교수
            <br />
            부산대학교 강의교수
            <br />
            생물교육, 이학석사(생물학), 교육학 박사(영재교육)
            <br />
            과학교육, 융합교육, 영재교육, 공학교육
            </>
          }
          email="zinayoon@gmail.com"
          call="010-4541-7741"
        />

        <Card 
          img={About3}
          name="조운석"
          position="디바이스 개발 담당"
          profile={
            <>
            부산대학교 과학교육연구소 전임연구원
            <br />
            부산대학교 강의교수
            <br />
            부산교육대학교 강의교수
            <br />
            이학박사(생명과학)
            <br />
            생태학, 하천생태학, 생태모델링, 과학교육
            </>
          }
          email="woonseok.cho@gmail.com"
          call="051)510-1877"
        />

        <Card 
          img={About4}
          name="이동영"
          position="외부참여 연구원"
          profile={
            <>
            해원초등학교
            <br />
            부산교육대학교 강의교수
            <br />
            이학박사수료(지구과학), 교육학석사(영재교육)
            <br />
            과학교육, 융합교육, STEM, Maker, 공학교육
            </>
          }
          email="shainare00@hanmail.net"
          call="051)510-1642"
        />

      </div>
    </>
  )
}