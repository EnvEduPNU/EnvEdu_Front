import { useEffect, useState } from "react"
import ViewSurveyList from "./Admin/ViewSurveyList";
import ViewSurveyContent from "./Respondent/ViewSurveyContent";

export default function Survey() {
    const [role, setRole] = useState('');

    useEffect(() => {
        setRole(localStorage.getItem('role')); 
    }, []);

    return(
        <div className="survey">
            {role === 'ROLE_ADMIN' ? <ViewSurveyList /> : <ViewSurveyContent />}
        </div>
    )
}