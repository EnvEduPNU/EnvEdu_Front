import React, { useState } from 'react';
import './education.css';
import testImg from './test.jpg'
import data1 from './data1.png'
import Editor from './ckeditor';

export default function EduEducator() {
  const [topics, setTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState('');
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState('');
  const [assign, setAssign] = useState([]);

  const handleChange1 = (event) => {
    setCurrentTopic(event.target.value);
  };

  const handleChange2 = (event) => {
    setCurrentChapter(event.target.value);
  };

  const handleAdd1 = () => {
    setTopics([...topics, currentTopic]);
    setCurrentTopic('');
  };

  const handleAdd2 = () => {
    setChapters([...chapters, currentChapter]);
    setCurrentChapter('');
  };
  //
  const addAssign = (e) => {
    setAssign()
  }

  const handleTopicClick = (value) => {
    setCurrentTopic(value === currentTopic ? '' : value);
  };

  const handleChapterClick = (value) => {
    setCurrentChapter(value === currentChapter ? '' : value);
  };

  //console.log(currentTopic)

  const [selectedOption, setSelectedOption] = useState('퀴즈형');
  const [showDiv, setShowDiv] = useState(false);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setShowDiv(false)
  };

  const handleCreateClick = () => {
    setShowDiv(true);
  };

  const [homeworkText, setHomeworkText] = useState('');
  const [displayedText, setDisplayedText] = useState('');

  const handleHomeworkChange = (event) => {
    setHomeworkText(event.target.value);
  };

  const handleRegisterClick = () => {
    setDisplayedText(homeworkText);
    setHomeworkText('');
  };

  //이미지 업로드
  const [profileImage, setProfileImage] = useState("");
  const [imgsrc, setImgsrc] = useState("");

  function onChangeImg(e) {
    setProfileImage(e.target.files[0]) //프로필 이미지
    setImgsrc(URL.createObjectURL(e.target.files[0])); //이미지 미리보기
  };



  return (
    <div style={{paddingLeft: '250px'}}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ fontWeight: 'bold' }}>주제</label>

        {topics.map((value, index) => (
          <div
            className={`topicBtn ${value === currentTopic ? 'selected' : ''}`}
            onClick={() => handleTopicClick(value)}
            key={index}
          >
            {value}
          </div>
        ))}

        <input
          className='addContent'
          value={currentTopic}
          onChange={handleChange1}
        />
        <button className='plusBtn' onClick={handleAdd1}>
          +
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
        <label style={{ fontWeight: 'bold' }}>차시</label>
        {chapters.map((value, index) => (
          <div
            className={`topicBtn ${value === currentChapter ? 'selected' : ''}`}
            onClick={() => handleChapterClick(value)}
            key={index}
          >
            {value}
          </div>
        ))}
        <input
          className='addContent'
          value={currentChapter}
          onChange={handleChange2}
        />
        <button className='plusBtn' onClick={handleAdd2}>
          +
        </button>
      </div>

        <div style={{display: 'flex', alignItems: 'flex-end'}}> 
            <select class="form-select" aria-label="Default select example" style={{marginTop: '30px', width: '200px'}} onChange={handleOptionChange}>
                <option value="퀴즈형" selected>퀴즈형 블록</option>
                <option value="과제형">과제형 블록</option>
                <option value="설명형">설명형 블록</option>
                <option value="데이터활동">데이터 활동 블록</option>
                <option value="데이터측정">데이터 측정 블록</option>
            </select>

            <button className='topicBtn' style={{border: 'none', marginBottom: '5px'}} onClick={handleCreateClick}>생성</button>
        </div>

       {showDiv && (
        <div style={{marginTop: '40px'}}>
          {/* 선택된 값에 따라 다른 내용을 보여줌 */}
          {selectedOption === '퀴즈형' && 
          <div>

<textarea className='homework' value={homeworkText} onChange={handleHomeworkChange} placeholder='내용을 입력해주세요'></textarea>


{displayedText && (
            <div style={{display: 'flex', alignItems: 'center'}}>
                <div className='homework'>{displayedText}</div>
                <button className='registerBtn' style={{ marginBottom: '12px' }} onClick={handleRegisterClick}>
                    수정하기
                </button>
            </div>
            
            
        )}
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
            
                {profileImage && (
  <div>
    <div style={{border: '1px solid black', marginTop: '15px', width: '800px', padding: '10px', height: '160px', borderRadius: '10px'}}>
      <div className="img_preview" style={{display: 'flex', justifyContent: 'center', border: '1px solid black', width: '138px', height: '138px', borderRadius: '10px', background: '#AEC0F0'}}>
        <img
          style={{width: '100px', height: '100px'}}
          alt="sample"
          src={imgsrc}
        />
      </div>
    </div>
  </div>
)}

      </div>
            
            <div>
<div>
            
            </div>
            </div>

      </div>
            <div style={{display: 'flex', marginLeft: '250px'}}>
      <button className='registerBtn2' style={{ marginBottom: '12px' }} onClick={handleRegisterClick}>
                등록하기
            </button>
            </div>
        </div>}

          {selectedOption === '과제형' && 
          <div>
            {displayedText && (
            <div style={{display: 'flex', alignItems: 'center'}}>
                <div className='homework'>{displayedText}</div>
                <button className='registerBtn' style={{ marginBottom: '12px' }} onClick={handleRegisterClick}>
                    수정하기
                </button>
            </div>
            
            
        )}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                
            <textarea className='homework' value={homeworkText} onChange={handleHomeworkChange}></textarea>
            <button className='registerBtn' style={{ marginBottom: '12px' }} onClick={handleRegisterClick}>
                등록하기
            </button>
      </div>
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
      )}

    </div>
  );
}
