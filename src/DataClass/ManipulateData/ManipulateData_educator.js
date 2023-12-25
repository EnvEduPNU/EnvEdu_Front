import { useState } from "react";
import { Link } from "react-router-dom";

import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Nav from 'react-bootstrap/Nav';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

export default function EducatorManipulateData() {
    const [memo, setMemo] = useState('');

    const handleMemoChange = (e) => {
        setMemo(e.target.value);
    };

    const [managedStudents, setManagedStudents] = useState([]);
    //const [sharedData, setSharedData] = useState([]);

    // 공유할 대상(학생) 선택
    const [selectedStudents, setSelectedStudents] = useState([]);
    const handleCheckbox = (studentUsername, studentId) => {
        const updatedSelectedStudents = selectedStudents.some(student => student.id === studentId)
            ? selectedStudents.filter(student => student.id !== studentId)
            : [...selectedStudents, { id: studentId, username: studentUsername }];
    
        setSelectedStudents(updatedSelectedStudents);
    };

    const [category, setCategory] = useState('my data 불러오기')
    return(
        <div>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>전송할 데이터 선택</Accordion.Header>
                    <Accordion.Body>
                        <Nav fill variant="tabs" defaultActiveKey="/home">
                            <Nav.Item onClick={()=>setCategory('my data 불러오기')}>
                                <Nav.Link eventKey="link-1">my data에서 불러오기</Nav.Link>
                            </Nav.Item>
                            <Nav.Item onClick={()=>setCategory('데이터 직접 업로드')}>
                                <Nav.Link eventKey="link-2">데이터 직접 업로드</Nav.Link>
                                
                            </Nav.Item>
                        </Nav>
                        {category === 'my data 불러오기' && <Table striped bordered hover style={{marginTop: '1rem'}}>
                            <thead>
                                <tr>
                                <th>일시</th>
                                <th>데이터 종류</th>
                                <th>메모</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td>2023-12-12</td>
                                <td>seed</td>
                                <td>.</td>
                                </tr>
                                <tr>
                                <td>2023-12-12</td>
                                <td>수질</td>
                                <td>.</td>
                                </tr>
                                <tr>
                                <td>2023-12-12</td>
                                <td>대기질</td>
                                <td>.</td>
                                </tr>
                            </tbody>
                        </Table>}
                        
                        {category === '데이터 직접 업로드' && <div style={{marginTop: '1rem'}}>
                            <input type="file" accept=".xlsx" />
                        </div>}
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                    <Accordion.Header>공유할 대상 선택</Accordion.Header>
                    <Accordion.Body>
                        <Form.Check 
                                type='radio'
                                id={`default-radio`}
                                label={`student1`}
                            />
                            <Form.Check 
                                type='radio'
                                id={`default-radio`}
                                label={`student2`}
                            />
                            <Form.Check 
                                type='radio'
                                id={`default-radio`}
                                label={`student3`}
                            />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                    <Accordion.Header>메모</Accordion.Header>
                    <Accordion.Body>
                        <InputGroup>
                            <Form.Control as="textarea" aria-label="With textarea" onChange={handleMemoChange} />
                        </InputGroup>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <div style={{display: 'flex', justifyContent: 'center', marginTop: '2rem'}}> 
                <Button variant="primary" style={{ width: '10rem' }}>확인</Button>
            </div>

            <div style={{display: 'flex', justifyContent: 'center', marginTop: '0.5rem'}}> 
                <Link to='/checkManipulateData'>
                    <Button variant="secondary" style={{ width: '10rem' }}>제출한 데이터 확인</Button>
                </Link>
            </div>
        </div>
    )
}