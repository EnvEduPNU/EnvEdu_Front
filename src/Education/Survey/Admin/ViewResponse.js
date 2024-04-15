import { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
import { customAxios } from '../../../Common/CustomAxios';
import '../Respondent/ViewSurveyContent.scss';

export default function ViewResponse() {
    const { inviteCode } = useParams();

    const [questionData, setQuestionData] = useState({});
    const [answerData, setAnswerData] = useState([]);

    useEffect(() => {
        customAxios.get(`/survey/answer/${inviteCode}`)
        .then((res) => {
            console.log(res.data);
            setQuestionData(res.data)
        })
        .catch((err) => console.log(err));

        customAxios.get(`/admin/survey/answer/list/${inviteCode}`)
        .then((res) => {
            console.log(res.data);
            setAnswerData(res.data);
        })
        .catch((err) => console.log(err));
    }, [inviteCode]);

    return(
        <div className="view-survey-content">
            <div className='invite-code' style={{ fontWeight: 'bold' }}>
                {questionData.surveyName}
            </div>

            {questionData.attributeName?.map((question, index) => {
                const questionKey = Object.keys(question)[0]; //질문의 ID
                const questionText = question[questionKey];
                
                return (
                    <div key={index} className="question-container">
                        <span>{index + 1}. {questionText}</span>

                        
                        {answerData?.map((answer, idx) => {
                            // answerList에서 현재 질문 ID와 일치하는 답변 찾기
                            const userAnswer = answer.answerList.find(ans => ans.surveyAttributeId.toString() === questionKey);
                            return (
                                <div key={idx} style={{ marginTop: '0.5rem', background: '#fff', padding: '0.5rem', borderRadius: '0.625rem' }}>
                                    {answer.sender ? answer.sender : "익명"}: {userAnswer ? userAnswer.answer : "답변 없음"}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    )
}