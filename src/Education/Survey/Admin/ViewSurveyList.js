import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { customAxios } from "../../../Common/CustomAxios";
import { FiExternalLink } from "react-icons/fi";
import { FaList } from "react-icons/fa";
import './ViewSurveyList.scss';

export default function ViewSurveyList() {
    const [data, setData] = useState([]);

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

    const navigate = useNavigate();

    const goToResponsePage = (inviteCode) => {
        navigate(`/view-response/${inviteCode}`);
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
                            <td>
                                <FiExternalLink 
                                    size="20" 
                                    onClick={() => goToResponsePage(item['inviteCode'])}
                                />
                            </td>
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