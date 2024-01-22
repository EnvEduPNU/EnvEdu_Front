import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { customAxios } from '../../../Common/CustomAxios';

function Sharing() {
    const [role, setRole] = useState();

    useEffect(() => {
        const user_role = localStorage.getItem("role");
        setRole(user_role);
        if (user_role === "ROLE_EDUCATOR") {
            customAxios.get('/educator/student_educator')
                .then((res) => setManagedStudents(res.data))
                .catch((err) => console.log(err));
        }
    }, []); 
    
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [managedStudents, setManagedStudents] = useState({});

    // 공유할 대상(학생) 선택
    const [selectedStudents, setSelectedStudents] = useState([]);
    const handleCheckbox = (studentUsername, studentId) => {
        const updatedSelectedStudents = selectedStudents.some(student => student.id === studentId)
            ? selectedStudents.filter(student => student.id !== studentId)
            : [...selectedStudents, { id: studentId, username: studentUsername }];
    
        setSelectedStudents(updatedSelectedStudents);
    };
    
    useEffect(() => {
        const allStudentsInfo = managedStudents.elems?.map(elem => {
            return { id: elem.id, username: elem.studentUsername };
        });
        setSelectedStudents(allStudentsInfo);
    }, [managedStudents.elems]);

    // 메모
    const [memo, setMemo] = useState('');

    const handleMemoChange = (e) => {
        setMemo(e.target.value);
    };
    
    const handleSharing = () => {
        const data = JSON.parse(localStorage.getItem("data"));

        if (data) {
            customAxios.post('/dataLiteracy/inviteStudent', {
                data: {
                    properties: data[0], 
                    data: data.slice(1),
                    memo: memo,
                    classId: 1, 
                    chapterId: 1,
                    sequenceId: 1
                },
                users: selectedStudents
            })
                .then(() => {
                    alert("공유되었습니다.");
                })
                .catch((err) => console.log(err));
        }
        else {
            alert("공유할 데이터를 선택해 주세요.")
        }
    }

    return (
        <>
        {role === 'ROLE_EDUCATOR' &&
            <Button
                style={{
                    position: "absolute",
                    right: "30px",
                    bottom: "50px",
                    width: '9rem'
                }}
                onClick={handleShow}
                >
                공유하기
                </Button>
        }
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>데이터 공유하기</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='interaction'>
                    <div>
                        <label className='labelEducator'>공유할 대상 선택</label>
                        {managedStudents.elems &&
                            <div className='managedStudentContainer' style={{ overflowX: 'scroll' }}>
                                {managedStudents.elems.map((elem, index) => (
                                    <div key={index}>
                                        <label>
                                            <input 
                                                type="checkbox" 
                                                onChange={() => handleCheckbox(elem.studentUsername, elem.id)}
                                                checked={selectedStudents?.some(student => student.id === elem.id)}
                                            />
                                            {elem.studentUsername}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        }   
                    </div>

                    <div>
                        <label className='labelEducator'>메모</label>   
                        <textarea onChange={handleMemoChange}/>
                    </div>


                    <div style={{display: 'flex', justifyContent: 'center', marginTop: '3rem'}}>
                        <button className='shareFileBtn' onClick={handleSharing}>공유하기</button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
        </>
    );
}

export default Sharing;