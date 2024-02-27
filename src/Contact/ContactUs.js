import { IoCall } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdLink } from "react-icons/io";

import Image1 from './Image/image1.jpg'

function ContactUs() {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className='team-circle'>
          <IoCall  size="45" color="#5e2ced" />
        </div>
        <h2 style={{ fontWeight: 'bold', margin: '1rem 0 5rem 0' }}>Contact</h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <img src={Image1} style={{ width: '25rem', marginRight: '2rem' }}/>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <dl>
            <dt style={{ fontSize: '1.25em', marginBottom: '1rem', padding: '0' }}>
              <a href="https://seie.pusan.ac.kr/earthedulab/index..do">부산대학교 과학·공학 융합교육 연구실</a>
            </dt>
            <dd>
              <MdOutlineMail size="25" /> ynam@pusan.ac.kr
            </dd>
            <dd>
              <IoMdCall size="25" /> 051-510-1642
            </dd>
            <dd>
              <FaLocationDot size="25" /> 부산광역시 금정구 부산대학로63번길 2 (장전동)
            </dd>
            <dd>
              <IoMdLink size="25" style={{ marginRight: '0.5rem' }}/> 
              <a href="https://seie.pusan.ac.kr/earthedulab/30456/subview.do">문의 및 대여 신청 게시판 바로가기</a>
            </dd>
          </dl>
        </div>
      </div>   
    </div>
  );
}
export default ContactUs;











