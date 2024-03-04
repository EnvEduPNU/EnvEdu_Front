import { Link } from "react-router-dom";
import styled from "styled-components";
import './Resource.scss';
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
//import { IoMdDownload } from "react-icons/io";
import { FaRegFilePdf } from "react-icons/fa";
import { RiFileHwpLine } from "react-icons/ri";

import cardImg1 from './Image/card1.jpg';
import cardImg2 from './Image/card2.jpg';
import cardImg3 from './Image/card3.jpg';
import cardImg4 from './Image/card4.jpg';
import cardImg5 from './Image/card5.jpg';
import cardImg6 from './Image/card6.jpg';
import cardImg7 from './Image/card7.png';
import cardImg8 from './Image/card8.jpg';

const CustomCardStyle = styled.div`
  margin-right: 1rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20rem;
  height: 26rem;
  border-radius: 0.3125rem;
  cursor: pointer;
  transition : 0.5s;
  border: 1px solid #eeeeee;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  &:hover {
    transform: translateY(-20px);
  }
  img {
    margin-top: 1rem;
    width: 18rem;
    height: 11rem;
  }
  h4 {
    text-align: center;
    width: 18rem;
    font-size: 1.25em;
    margin-top: 1rem;
    font-weight: bold;
  }
  span {
    width: 18rem;
    margin-top: 1.5rem;
    font-size: 0.75em;
    color: #5e2ced;
  }
  a {
    text-decoration: none;
    color: #636363;
  }
`

const CustomCard = ({ img, title, fileName1, fileName2, link1, link2, tag }) => {
  return (
    <CustomCardStyle>
      <img src={img}/>
      <h4>{title}</h4>
      <a href={link1}>
        <div style={{ textAlign: 'left', padding: '0.2rem 0.5rem', fontSize: '0.9em', margin: '1rem 0 0.5rem 0', background: '#f2f2f2', width: '18rem', borderRadius: '0.3125rem' }}>
          <FaRegFilePdf size="18" /> {fileName1}
        </div>
      </a>
      <a href={link2}>
        <div style={{ textAlign: 'left', padding: '0.2rem 0.5rem', fontSize: '0.9em', background: '#f2f2f2', width: '18rem', borderRadius: '0.3125rem' }}>
          <RiFileHwpLine size="20" /> {fileName2}
        </div>
      </a>
      <span>{tag}</span>
    </CustomCardStyle>
  )
}

export default function Resource() {
  return (
    <div className='resource'>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className='team-circle'>
          <HiOutlineClipboardDocumentList  size="45" color="#5e2ced" />
        </div>
        <h2 style={{ fontWeight: 'bold', margin: '1rem 0 5rem 0' }}>교육 자료</h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', justifyContent: 'center' }}>
          <CustomCard 
            img={cardImg1}
            title="수권에 대한 이해"
            fileName1="수권에 대한 이해.pdf"
            fileName2="수권에 대한 이해.hwp"
            link1="https://drive.google.com/file/d/1YDSKdlXX7S5XzFU2iEQsnyZWGjdTd-Vz/view"
            link2=""
            tag="#중고등학생용 환경교육 교수학습자료"
          />

          <CustomCard 
            img={cardImg2}
            title="기권에 대한 이해"
            fileName1="기권에 대한 이해.pdf"
            fileName2="기권에 대한 이해.hwp"
            link1="https://drive.google.com/file/d/1XQcFjPtchXb08-EMdp-rGP78IVfU4rbU/view"
            link2=""
            tag="#중고등학생용 환경교육 교수학습자료"
          />

          <CustomCard 
            img={cardImg3}
            title="지권에 대한 이해"
            fileName1="지권에 대한 이해.pdf"
            fileName2="지권에 대한 이해.hwp"
            link1="https://drive.google.com/file/d/14HvcuOELohPCjX5_tR_toiNIraOQ8wR9/view"
            link2=""
            tag="#중고등학생용 환경교육 교수학습자료"
          />  

          <CustomCard 
            img={cardImg4}
            title="생태계에 대한 이해"
            fileName1="생태계에 대한 이해.pdf"
            fileName2="생태계에 대한 이해.hwp"
            link1=""
            link2=""
            tag="#중고등학생용 환경교육 교수학습자료"
          />  

          <CustomCard 
            img={cardImg5}
            title="생태계보전과 친환경공원 조성"
            fileName1="생태계보전과 친환경공원 조성.pdf"
            fileName2="생태계보전과 친환경공원 조성.hwp"
            link1="https://drive.google.com/file/d/12tUi_yOCd3d-iQfJac0ifMlgNTeQNc81/view"
            link2="https://drive.google.com/file/d/1TjsTR-xSOFhEsqW6XiOnYrgil4uEahot/view"
            tag="#환경 동아리 활동∙MEA∙공학설계 활동을 위한 교수학습자료"
          />  

          <CustomCard 
            img={cardImg6}
            title="지역환경문제에 관한 사회과학쟁점"
            fileName1="지역환경문제에 관한 사회과학쟁점.pdf"
            fileName2="지역환경문제에 관한 사회과학쟁점.hwp"
            link1="https://drive.google.com/file/d/12zN3TPFO_1QjkA7Zb8W2YozHuGiDT8JL/view"
            link2="https://drive.google.com/file/d/1DcwaBCsRC6uae23oiMTC6FdL971MiHN4/view"
            tag="#환경 동아리 활동∙MEA∙공학설계 활동을 위한 교수학습자료"
          />  

          <CustomCard 
            img={cardImg7}
            title="환경교육용보드게임 디자인 활동"
            fileName1="환경교육용보드게임 디자인 활동.pdf"
            fileName2="환경교육용보드게임 디자인 활동.hwp"
            link1="https://drive.google.com/file/d/1YTOCMMEdZ2a5Gmjz477rK-MFNzYrNr1f/view"
            link2="https://drive.google.com/file/d/1-hpHZEkcBjdZYoF2zPU163oX6egmByVK/view"
            tag="#환경 동아리 활동∙MEA∙공학설계 활동을 위한 교수학습자료"
          />  

          <CustomCard 
            img={cardImg8}
            title="미세먼지청정학교 위치 선정하기"
            fileName1="미세먼지청정학교 위치 선정하기.pdf"
            fileName2="미세먼지청정학교 위치 선정하기.hwp"
            link1="https://drive.google.com/file/d/1akLeg_abZjPLD9ppPRIK0pZFDPfYL96s/view"
            link2="https://drive.google.com/file/d/1Ps3LR4bcfCxpNJqyXi6zxa4oQTqJqxtg/view"
            tag="#환경 동아리 활동∙MEA∙공학설계 활동을 위한 교수학습자료"
          />  
        </div>
      </div>
    </div>
  )
}