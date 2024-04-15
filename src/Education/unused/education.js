import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EduEducator from "./educator/education_educator";
import EduStudent from "./student/education_student";

export default function Education() {
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('role') == null) {
            alert("로그인 후 이용해주세요")
            navigate('/');
        } else {
            setRole(localStorage.getItem('role'));
        }
      }, [])
    
    console.log(role)

    return(
        <div>
            {role == "ROLE_EDUCATOR" && <EduEducator />}
            {role == "ROLE_STUDENT" && <EduStudent />}
        </div>
    )
}