import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateSurvey.scss';
import { customAxios } from '../../../Common/CustomAxios';

export default function CreateSurvey() {
    const [questions, setQuestions] = useState([{ id: Date.now(), text: "" }]);
    const [surveyName, setSurveyName] = useState(null);

    const addQuestion = () => {
        setQuestions([...questions, { id: Date.now(), text: "" }]);
    };

    const updateQuestionText = (id, text) => {
        setQuestions(
            questions.map(q => (q.id === id ? { ...q, text: text } : q))
        );
    };

    const navigate = useNavigate();

    const createSurvey = () => {
        if (!surveyName) {
            alert("설문지 제목을 작성해주세요.");
        }
        else {
            const attribute = questions.map((q) => q.text);

            customAxios.post('/admin/survey/create', {
                surveyName: surveyName,
                surveyAttribute: attribute
            })
            .then((res) => {
                alert("등록되었습니다.");
                console.log(res.data);
                navigate('/upload-reward', { state: { code: res.data } });
            })
            .catch((err) => console.log(err))
        }
    }

    return (
        <div className="create-survey">
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                    className="submit-btn"
                    onClick={createSurvey}
                >
                    저장
                </button>
            </div>

            <hr />
            {/*
            <h4 style={{ fontWeight: 'bold', marginBottom: '2rem' }}><FaPencil /> 설문지 등록</h4>
            */}
            <div className='question-container'>
                <span>제목</span>
                <input
                    type="text"
                    onChange={(e) => setSurveyName(e.target.value)}
                    placeholder="제목을 입력해주세요."
                />
            </div>

            {questions.map((question, index) => (
                <div key={question.id} className='question-container'>
                    <span>{`질문 ${index + 1}`}</span>
                    <input
                        type="text"
                        value={question.text}
                        onChange={(e) => updateQuestionText(question.id, e.target.value)}
                        //placeholder={`질문 ${index + 1}`}
                        placeholder="질문을 입력해주세요."
                    />
                </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button 
                    className="plus-btn"
                    onClick={addQuestion}
                >
                    +
                </button>
            </div>
        </div>
    )
}