import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function TopSlidePage() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500, 
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return(
        <div>
            <Slider {...settings}>
                <div>
                    <h4 style={{ textAlign: 'center', marginTop: '1rem' }}>우리 학교의 공기질 측정하기</h4>
                    <div style={{display: 'flex', justifyContent: 'center', margin: '3rem 0' }}>
                        <div>
                            1차시:  교실의 공기질 측정하기<br/>
                            2차시 : 학교의 여러장소 공기질 측정하기<br/>
                            3차시 : 교실과 학교의 장소별 공기질 비교하기
                        </div>
                    </div>
                </div>

                
                <div>
                    <h4 style={{ textAlign: 'center', marginBottom: '1rem', marginTop: '1rem' }}>1차시:  교실의 공기질 측정하기</h4>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '0.5rem' }}>학습 목표</div>
                    <div style={{display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                        <div>
                            교실 공간의 공기질의 구성성분을 이해할 수 있다. <br/>
                            교실 공간의 공기질 측정할 수 있다. <br/>
                            실내생활에서 공기질의 중요성을 인식한다.
                        </div>
                    </div>
                </div>
            </Slider>
        </div>
    )
}