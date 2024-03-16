import { useEffect, useState } from "react"
import ViewSurveyList from "./Admin/ViewSurveyList";

export default function Survey() {
    const [role, setRole] = useState('');
    /*
    useEffect(() => {
        setRole(localStorage.getItem('role')); 
    }, [])
    */
    return(
        <div>
            {/*
            {role === 'ROLE_ADMIN' ? <ViewSurveyList /> : <></>}
    */}
            <ViewSurveyList />
        </div>
    )
}