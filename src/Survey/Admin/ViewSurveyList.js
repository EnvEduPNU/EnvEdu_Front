import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { customAxios } from '../../Common/CustomAxios';
import { FiExternalLink } from "react-icons/fi";
import { FaList } from "react-icons/fa";
import './ViewSurveyList.scss';

export default function ViewSurveyList() {
    const [data, setData] = useState([
        {
            surveyName: "설문 조사 시작할게요",
            inviteCode: "55TLZO",
            createTime: "2023-12-18T03:19:55.332118",
            attributeName: ['abc']
        },
        {
            surveyName: "설문 조사 시작할게요2",
            inviteCode: "21TJN5",
            createTime: "2023-12-18T03:20:45.981928",
            attributeName: []
        }
    ]);

    useEffect(() => {
        customAxios.get('/admin/survey/list')
        .then((res) => {
            console.log(res.data);
            setData(res.data);
        })
        .catch((err) => console.log(err));
    }, []);

    const formatDate = (date) => {
        return date.split("T")[0] + " " + date.split("T")[1].slice(0, 5);
    }

    return (
        <div className="view-survey-list">
            <h4 style={{ fontFamily: 'Poppins', fontWeight: 'bold' }}><FaList /> My Survey List</h4>
            <table className="survey-list">
                <thead>
                    <tr>
                        {['제목', '초대 코드', '생성일자', '바로가기'].map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr>
                            <td>{item['surveyName']}</td>
                            <td>{item['inviteCode']}</td>
                            <td>{formatDate(item['createTime'])}</td>
                            <td><FiExternalLink size="20" /></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link to="/create-survey" style={{ textDecoration: 'none' }}>
                    <button className="plus-btn">+</button>
                </Link>
            </div>
        </div>
    )
}