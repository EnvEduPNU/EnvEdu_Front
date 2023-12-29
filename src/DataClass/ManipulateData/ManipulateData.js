import { useState, useEffect } from 'react';
import EducatorManipulateData from './ManipulateData_educator'
import StudentManipulateData from './ManipulateData_student'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManipulateData() {
    const [role, setRole] = useState('');
    useEffect(() => {
        setRole(localStorage.getItem('role'));
        console.log(role)
    }, [])
    
    return(
        <div style={{ marginTop: '2rem' }}>
            {role === 'ROLE_EDUCATOR' && <EducatorManipulateData />}
            {role === 'ROLE_STUDENT' && <StudentManipulateData />}
        </div>
    )
}