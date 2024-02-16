import './Implementation.scss';
import train1 from '../Train/Image/training1.jpeg';
import { FaSchool } from "react-icons/fa";

export default function Implementation() {
    return(
        <div className="container">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className='team-circle'>
                    <FaSchool size="45" color="#5e2ced" />
                </div>
                <h2 style={{ fontFamily: 'Poppins', fontWeight: 'bold', margin: '1rem 0 5rem 0' }}>Implementation</h2>
            </div>
            
            <div className="student">
                <h2><b>현장적용</b></h2>
                <hr/>
                <div className="row featurette" style={{ padding: '1.5rem' }}>
                <div className="col-md-7 order-md-2">
                    <ul className="lead">
                        <li>유초등 현장적용 현장</li>
                        <li>중학교 현장적용 현장
                        </li>
                        <li>고등학교 현장적용 현장</li>
                    </ul>
                </div>
                <div className="col-md-5 order-md-1">
                    <img src={train1} width="100%" Link to ='/tboard'/>
                </div>
            </div>
          </div>
        </div>
    )
}