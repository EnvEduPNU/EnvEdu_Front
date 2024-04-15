import { useState } from 'react';
import './modal.css';

export default function Modal({selectedOption, handleShowing}) {
    const [modalSelectedOption, setModalSelectedOption] = useState('퀴즈형');

    const handleOptionChange = (e) => {
        setModalSelectedOption(e.target.value);
    };

    return(
        <div className='modal-container'>
            <div className='close-btn' onClick={handleShowing}>X</div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div>
                    <input style={{width: '3rem'}}></input>
                    <label style={{marginLeft: '0.3rem'}}>차시</label>
                </div>
                <div style={{marginLeft: '1rem'}}>
                    <input style={{width: '10rem'}} placeholder='주제'></input>
                </div>
                <div style={{marginLeft: '1rem'}}>
                    <select class="form-select" style={{width: '10rem'}} onChange={handleOptionChange}>
                        <option value="퀴즈형" selected>퀴즈형 블록</option>
                        <option value="과제형">과제형 블록</option>
                        <option value="설명형">설명형 블록</option>
                        <option value="데이터활동">데이터 활동 블록</option>
                        <option value="데이터측정">데이터 측정 블록</option>
                    </select>
                </div>  
            </div>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '5rem'}}>
                <button className='add-btn-modal' onClick={() => handleShowing(modalSelectedOption)}>추가하기</button>
            </div>
        </div>
    )
}