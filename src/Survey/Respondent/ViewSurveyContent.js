import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Admin/CreateSurvey.scss';
import './ViewSurveyContent.scss';
import { customAxios } from '../../Common/CustomAxios';

export default function ViewSurveyContent() {
    const [inviteCode, setInviteCode] = useState('');
    const [sender, setSender] = useState('');
    
    const [data, setData] = useState({});

    const enterCode = () => {
        customAxios.get(`/survey/answer/${inviteCode}`)
        .then((res) => setData(res.data))
        .catch((err) => {
            console.log(err);
            alert("유효하지 않은 코드입니다.");
        })
    }

    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        if (Object.keys(data).length > 0) {
            const initialAnswers = data.attributeName.map((_, index) => ({[index + 1]: ""}));
            setAnswers(initialAnswers);
        }
    }, [data.attributeName]);

    const updateQuestionText = (index, value) => {
        const newAnswers = answers.map((answer, i) => {
            if (index === i) {
                const key = Object.keys(answer)[0];
                return { [key]: value };
            }
            return answer;
        });
        setAnswers(newAnswers);
    };

    const navigate = useNavigate();

    const submitSurvey = () => {
        customAxios.post(`/survey/answer/${inviteCode}`, {
            sender: sender,
            answer: answers
        })
        .then((res) => {
            console.log(res);
            alert("제출되었습니다.");
            //navigate('/view-reward', { state: { imgUrl: 'abc' } }); // 수정 필요
        })
        .catch((err) => console.log(err))
    }

    return (
        <div className="view-survey-content">
            <div className='invite-code'>
                <label style={{ marginBottom: '0.5rem' }}>설문조사 초대 코드를 입력해주세요!</label>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        className='invite-code-input'
                        type="text"
                        onChange={(e) => setInviteCode(e.target.value)}
                    />

                    <button className="upload-btn" onClick={enterCode}>
                        Enter
                    </button>
                </div>
            </div>

            <h4>
                {data.surveyName}
            </h4>

            <hr />

            {Object.keys(data).length > 0 &&
                <div className='question-container'>
                    <span>이름</span>
                    <input
                        type="text"
                        onChange={(e) => setSender(e.target.value)}
                        placeholder="이름을 입력해주세요."
                    />
                </div>
            }

            {Object.keys(data).length > 0 && data.attributeName.map((question, index) => (
                <div key={index} className='question-container'>
                    <span>{index + 1}. {question[(index + 1).toString()]}</span>

                    <input
                        type="text"
                        value={answers[index]?.[index + 1] || ""}
                        onChange={(e) => updateQuestionText(index, e.target.value)}
                        placeholder="답변을 입력해주세요."
                    />
                </div>
            ))}

            {Object.keys(data).length > 0 &&
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                    <button className="upload-btn" onClick={submitSurvey}>
                        Submit
                    </button>
                </div>
            }
        </div>
    )
}