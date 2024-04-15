import { useState } from 'react';
import Modal from './modal';
import Editor from './educator/ckeditor';
import testImg from './educator/test.jpg';
import data1 from './educator/data1.png'
import './test.css';

export default function Test() {
    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState('퀴즈형');
    
    const handleShowing = (selectedValue) => {
        setSelectedOption(selectedValue);
        setShowModal(false);
    }

    const [profileImage, setProfileImage] = useState("");
    const [imgsrc, setImgsrc] = useState("");

    function onChangeImg(e) {
        setProfileImage(e.target.files[0]) //프로필 이미지
        setImgsrc(URL.createObjectURL(e.target.files[0])); //이미지 미리보기
    };

    return(
        <div>
            <div className="chapter-box-num">
                1차시
            </div>
            <div className="chapter-box-content">
                <div className='container'>
                    <div className="classific" style={{background: '#EE2E31'}}>퀴즈</div>
                    <div>1차시 퀴즈 [~ 8/4]</div>
                </div>
                <div className='container'>
                    <div className="classific" style={{background: '#F4C095'}}>과제</div>
                    <div>1차시 과제 [~ 8/4]</div>
                </div>
                <div className='container'>
                    <div className="classific" style={{background: '#679289'}}>설명</div>
                    <div>1차시 설명</div>
                </div>
                <div className='container'>
                    <div className="classific" style={{background: '#1D7874'}}>데이터 활동</div>
                    <div>1차시 데이터 활동</div>
                </div>
                <div className='container'>
                    <div className="classific" style={{background: '#071E22'}}>데이터 측정</div>
                    <div>1차시 데이터 측정</div>
                </div>
            </div>

            <div className="chapter-box-num">
                2차시
            </div>
            <div className="chapter-box-content">
                <div className='container'>
                    <div className="classific" style={{background: '#EE2E31'}}>퀴즈</div>
                    <div>2차시 퀴즈 [~ 8/11]</div>
                </div>
                <div className='container'>
                    <div className="classific" style={{background: '#F4C095'}}>과제</div>
                    <div>2차시 과제 [~ 8/11]</div>
                </div>
                <div className='container'>
                    <div className="classific" style={{background: '#679289'}}>설명</div>
                    <div>2차시 설명</div>
                </div>
                <div className='container'>
                    <div className="classific" style={{background: '#1D7874'}}>데이터 활동</div>
                    <div>2차시 데이터 활동</div>
                </div>
                <div className='container'>
                    <div className="classific" style={{background: '#071E22'}}>데이터 측정</div>
                    <div>2차시 데이터 측정</div>
                </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'center'}}>
                <button 
                    className='add-block-btn'
                    onClick={() => setShowModal(true)}
                >+</button>
            </div>

            {showModal && <Modal handleShowing={handleShowing} />}

            <div style={{display: 'flex', justifyContent: 'center', marginTop: '3rem'}}>

            {selectedOption === '퀴즈형' && (
            <div>
            <textarea className='homework' placeholder='내용을 입력해주세요'></textarea>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>
                <div className="imgUpload_btn">
                    <input
                    name="imgUpload"
                    type="file"
                    accept="image/*"
                    onChange={onChangeImg}
                    />
                </div>
                {imgsrc && (
                    <div>
                    <div style={{ border: '1px solid black', marginTop: '15px', width: '800px', padding: '10px', height: '160px', borderRadius: '10px' }}>
                        <div className="img_preview" style={{ display: 'flex', justifyContent: 'center', border: '1px solid black', width: '138px', height: '138px', borderRadius: '10px', background: '#AEC0F0' }}>
                        <img
                            style={{ width: '100px', height: '100px' }}
                            alt="sample"
                            src={imgsrc}
                        />
                        </div>
                    </div>
                    </div>)}
                </div>
                <div>
                <div>

                </div>
                </div>
            </div>
            </div>
            )}

            {selectedOption === '과제형' && 
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    
                    <textarea className='homework'></textarea>
                    <button className='registerBtn' style={{ marginBottom: '12px' }}>
                        등록하기
                    </button>
                </div>}

            {selectedOption === '설명형' && 
            <div>
                <Editor />
            </div>}

            {selectedOption === '데이터활동' && 
            <div>
                <div class="row row-cols-1 row-cols-md-3 g-4">
                    <div class="col">
                        <div class="card h-100">
                        <img src={testImg} class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title">산성비 pH bar 활동</h5>
                            <p class="card-text">설명</p>
                        </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card h-100">
                        <img src={testImg} class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title">해양산성화 퍼즐 활동 </h5>
                            <p class="card-text">설명</p>
                        </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card h-100">
                        <img src={testImg} class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title">활동A</h5>
                            <p class="card-text"> 설명</p>
                        </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card h-100">
                        <img src={testImg} class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title">활동B</h5>
                            <p class="card-text">설명</p>
                        </div>
                        </div>
                    </div>
                </div>
                </div>}

            {selectedOption === '데이터측정' && <div>
            <div class="row row-cols-1 row-cols-md-3 g-4">
                <div class="col">
                    <div class="card h-100">
                    <img src={data1} class="card-img-top" alt="..." />
                    <div class="card-body">
                        <h5 class="card-title">점 데이터</h5>
                        <p class="card-text">설명</p>
                    </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100">
                    <img src={data1} class="card-img-top" alt="..." />
                    <div class="card-body">
                        <h5 class="card-title">연속 데이터</h5>
                        <p class="card-text">설명</p>
                    </div>
                    </div>
                </div>
                </div>
                </div>}
            </div>

        </div>
    );
}