import './Training.css';
import train2 from './Image/Training2.png';
//import train1 from './Image/training1.jpeg';
import train0 from './Image/train0.jpeg';
import { FaChalkboardTeacher } from "react-icons/fa";

function Training (){
    return(
        <>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className='team-circle'>
                    <FaChalkboardTeacher size="45" color="#5e2ced" />
                </div>
                <h2 style={{ fontFamily: 'Poppins', fontWeight: 'bold', margin: '1rem 0 5rem 0' }}>Training</h2>
            </div>
        <div className="container">
          <div className="student">
            <h2><b>교사 연수</b></h2>
            <hr/>
            <div className="row featurette" style={{ padding: '1.5rem' }}>
              <div className="col-md-7 order-md-2">
                <p id="te">
                  스마트 환경교육 연수는 환경 교육에 대한 이해를 고취시키고 교육과정 기반의 환경교육 프로그램 활용을 위한 스마트 환경모니터링 킷의 현장 보급과 확산에 있다. 따라서 스마트 측정기기에 대한 활용교육과 함께 환경교육프로그램 활용에 대한 현장 교사들의 의견을 수렴하여 학교현장에서 실제 적용가능하고 활용성이 높은 교육자료로서 현장적용 가능성을 검증한다. 이를 기반으로 환경교육에서의 스마트 측정기기 활용방법과 적용에 대한 이해를 돕고 학생들의 수준에 맞는 스마트 기기 활용 교육을 학교 현장에 확산하고자 한다.
                  이를 위해 개발된 교육프로그램을 참여 교사들과 협업하여 각 학교급별 대상별[유초등(스토리텔링북), 중고등(온라인/오프라인 학습자료), 교사(지도사)]로 적용하여 스마트 환경교육 보급의 토대를 마련하고 아울러 연구과정에서 개발된 효과검증 도구(검사지)를 함께 활용하여 적용된 프로그램의 효과를 과학적으로 검증할 수 있도록 지원한다.
                </p>
              </div>
              <div className="col-md-5 order-md-1">
                <img src={train0} width="100%" Link to ='/tboard'/>
              </div>
            </div>
          </div>

          <div className="student" style={{ marginTop: '3rem' }}>
            <h2><b>사회환경지도사 연수</b></h2>
            <hr/>
            <div className="row featurette" style={{ padding: '1.5rem' }}>
              <div className="col-md-7 order-md-2">
                <ul className="lead">
                  <li>스마트 환경교육을 위한 디바이스 활용 교사 (온라인) 연수 현장</li>
                  <li>과학관 강사 및 해설사 교육 연수 현장</li>
                  <li>스마트 환경교육을 위한 사회환경 지도사 연수 현장</li>
                  <li>과학관 강사 및 해설사 교육 연수 현장</li>
                </ul>
              </div>
              <div className="col-md-5 order-md-1">
                <img src={train2} width="100%" Link to ='/tboard'/>
              </div>
            </div>
          </div>
      
        </div>
      </>
    );
}
export default Training;




































