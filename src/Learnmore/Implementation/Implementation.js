import './Implementation.scss';
import { FaSchool } from "react-icons/fa";

import img1 from './Image/img1.jpg';
import img2 from './Image/img2.png';
import img3 from './Image/img3.jpg';
import img4 from './Image/img4.jpg';
import img5 from './Image/img5.jpg';
import img6 from './Image/img6.jpg';
import img7 from './Image/img7.png';
import img8 from './Image/img8.png';
import img9 from './Image/img9.png';
import img10 from './Image/img10.png';

export default function Implementation() {
    return(
        <div className="container">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className='team-circle'>
                    <FaSchool size="45" color="#5e2ced" />
                </div>
                <h2 style={{ fontWeight: 'bold', margin: '1rem 0 5rem 0' }}>현장 적용</h2>
            </div>
            
            <div className="implementation-pic">
                <div className="student">
                    <h4><b>유초등 현장 적용</b></h4>
                    <hr/>
                    <div style={{ padding: '1.5rem', display: 'flex' }}>
                        <figure>
                            <img src={img1} />
                            <figcaption>
                                용존산소량 측정
                            </figcaption>
                        </figure>
                        <figure>
                            <img src={img2} />
                            <figcaption>
                                토양 수분 측정
                            </figcaption>
                        </figure>
                        <figure>
                            <img src={img3} />
                            <figcaption>
                                토양 pH 측정
                            </figcaption>
                        </figure>
                    </div>
                </div>

                <div className="student" style={{ marginTop: '3rem' }}>
                    <h4><b>중등 현장 적용</b></h4>
                    <hr/>
                    <div style={{ padding: '1.5rem', display: 'flex' }}>
                        <figure>
                            <img src={img4} />
                            <figcaption>
                                미세먼지 측정
                            </figcaption>
                        </figure>
                        <figure>
                            <img src={img5} />
                            <figcaption>
                                데이터 변환
                            </figcaption>
                        </figure>
                        <figure>
                            <img src={img6} />
                            <figcaption>
                                데이터 송신
                            </figcaption>
                        </figure>
                    </div>
                </div>

                <div className="student" style={{ marginTop: '3rem' }}>
                    <h4><b>사회환경교육 현장 적용</b></h4>
                    <hr/>
                    <div style={{ padding: '1.5rem', display: 'flex' }}>
                        <figure>
                            <img src={img7} />
                            <figcaption>
                                측정 장치 - 어플리케이션 연결
                            </figcaption>
                        </figure>
                        <figure>
                            <img src={img8} />
                            <figcaption>
                                어플리케이션 사용
                            </figcaption>
                        </figure>
                        <figure>
                            <img src={img9} />
                            <figcaption>
                                물환경 센서 측정
                            </figcaption>
                        </figure>
                        <figure>
                            <img src={img10} />
                            <figcaption>
                                센서 변경 및 측정
                            </figcaption>
                        </figure>
                    </div>
                </div>
        
            </div>
        </div>
    )
}