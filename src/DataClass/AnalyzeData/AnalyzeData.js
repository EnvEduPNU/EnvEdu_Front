import { useState, useEffect } from 'react';
import EducatorAnalyzeData from './AnalyzeData_educator'
import StudentAnalyzeData from './AnalyzeData_student'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AnalyzeData() {
    const [role, setRole] = useState('');
    useEffect(() => {
        setRole(localStorage.getItem('role'));
        console.log(role)
    }, [])

    return(
        <div style={{ marginTop: '2rem' }}>
            {role === 'ROLE_EDUCATOR' && <EducatorAnalyzeData />}
            {role === 'ROLE_STUDENT' && <StudentAnalyzeData />}
        </div>
    )
}