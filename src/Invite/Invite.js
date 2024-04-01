import { useEffect, useState } from 'react';
import styled from 'styled-components';
import './Invite.scss';
import { customAxios } from '../Common/CustomAxios';

import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

const CustomButton = styled.button`
    background: rgb(94, 44, 237);
    border-radius: 1.25rem;
    color: #fff;
    font-weight: bold;
    width: 10rem;
    height: 2rem;
    border: none;
`

export default function Invite() {
    const [role, setRole] = useState('');
    const [code, setCode] = useState('');
    const [codeInput, setCodeInput] = useState('');
    const [studentData, setStudentData] = useState([]);

    useEffect(() => {
        const role = localStorage.getItem('role');
        setRole(role);
        if (role === 'ROLE_EDUCATOR') {
            customAxios.get('/educator/student_educator')
            .then((res) => {
                console.log(res.data);
                setStudentData(res.data.elems);
            })
            .catch((err) => console.log(err));
        }
    }, []);

    const generateCode = () => {
        customAxios.get('/educator/inviteCode/generate')
        .then((res) => {
            console.log(res.data);
            setCode(res.data);
        })
        .catch((err) => console.log(err));
    }

    const getCode = () => {
        customAxios.get(`/student/join/${codeInput}`)
        .then((res) => {
            //console.log(res.data);
            alert("초대가 완료되었습니다.");
        })
        .catch((err) => {
            console.log(err);
            alert("유효하지 않은 코드입니다.");
        });
    }

    return(
        <div className='invite'>
            {role === 'ROLE_EDUCATOR' && <div>
                <CustomButton  onClick={generateCode}>초대 코드 생성</CustomButton>
                {code && <span style={{ marginLeft: '1rem' }}>초대 코드는 {code}입니다.</span>}
                
                <div style={{ marginTop: '1rem'}}>
                    <span>초대한 학생 목록</span>
                    <Table striped bordered hover>
                        <thead style={{ background: '#f4f0ff', textAlign: 'center' }}>
                            <tr>
                                <th>educator Username</th>
                                <th>ID</th>
                                <th>student Username</th>
                            </tr>
                        </thead>
                        <tbody style={{ textAlign: 'center' }}>
                        {studentData.map((data) => (
                            <tr>
                                <td>{data.educatorUsername}</td>
                                <td>{data.id}</td>
                                <td>{data.studentUsername}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                
                </div>
            </div>}

            {role === 'ROLE_STUDENT' && <div>
                <Form>
                    <Form.Label>초대 코드를 입력해 주세요.</Form.Label>
                    <Form.Control onChange={(e) => setCodeInput(e.target.value)}/>

                    <CustomButton onClick={getCode}>확인</CustomButton>
                </Form>
            </div>}
        </div>
    )
}