import { useState, useEffect } from 'react';
import EducatorReadData from './ReadData_educator';
import StudentReadData from './ReadData_student';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ReadData() {
    const [role, setRole] = useState('');
    useEffect(() => {
        setRole(localStorage.getItem('role'));
        console.log(role)
    }, [])

    return(
        <div style={{ marginTop: '2rem' }}>
            {role === 'ROLE_EDUCATOR' && <EducatorReadData />}
            {role === 'ROLE_STUDENT' && <StudentReadData />}
        </div>
    )
}