import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { customAxios } from '../Common/CustomAxios';
import * as XLSX from 'xlsx';
import './interaction.scss';

export default function InterAction() {
    const [role, setRole] = useState(null);
    const [managedStudents, setManagedStudents] = useState([]);

    useEffect(() => {
        const user_role = localStorage.getItem("role");
        setRole(user_role);

        if (user_role === "ROLE_EDUCATOR") {
            customAxios.get('/educator/student_educator')
                .then((res) => setManagedStudents(res.data))
                .catch((err) => console.log(err));
        };
    }, []); 

    // 공유할 대상(학생) 선택
    const [selectedStudents, setSelectedStudents] = useState([]);
    const handleCheckbox = (studentUsername, studentId) => {
        const updatedSelectedStudents = selectedStudents.some(student => student.id === studentId)
            ? selectedStudents.filter(student => student.id !== studentId)
            : [...selectedStudents, { id: studentId, username: studentUsername }];
    
        setSelectedStudents(updatedSelectedStudents);
    };

    // excel 파일 읽기
    const [excelData, setExcelData] = useState([]);

    const readExcel = (file) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = (e) => {
            const bufferArray = e.target.result;
            const workbook = XLSX.read(bufferArray, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const data = XLSX.utils.sheet_to_json(worksheet, {header: 1});
            setExcelData(data);
        };
    };
  
    const handleExcelFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            readExcel(file);
        }
    };

    // 메모
    const [memo, setMemo] = useState('');

    const handleMemoChange = (e) => {
        setMemo(e.target.value);
    };

    const handleSharing = () => {
        customAxios.post('/dataLiteracy/inviteStudent', {
            data: {
                properties: excelData[0], 
                data: excelData.slice(1),
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
    //console.log(excelData);

    const [sharedData, setSharedData] = useState([]);
    
    const handleGetData = () => {
        customAxios.get('/dataLiteracy/sequenceData?classId=1&chapterId=1&sequenceId=1')
            .then((res) => {
                setSharedData(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const [properties, setProperties] = useState([]);
    const [cellValues, setCellValues] = useState([]);

    useEffect(() => {
        if (sharedData.length > 0) {
            // properties 업데이트
            const newProperties = sharedData[0].properties.split(', ');
            setProperties(newProperties);
    
            // cellValues 업데이트
            const newCellValues = sharedData.map(row => row.data.split(', '));
            setCellValues(newCellValues);
        }
    }, [sharedData]);

    // 학생이 데이터 값 수정하기
    console.log(cellValues)
    const handleHeaderChange = (index, value) => {
        const updatedProperties = [...properties];
        updatedProperties[index] = value;
        setProperties(updatedProperties);
    };
    
    const handleCellChange = (rowIndex, cellIndex, value) => {
        const updatedCellValues = [...cellValues];
        updatedCellValues[rowIndex][cellIndex] = value;
        setCellValues(updatedCellValues);
    };

    const handleModify = () => {
        customAxios.put('/dataLiteracy/sequenceData', {
            properties: properties,
            data: cellValues,
            memo: sharedData[0].memo,
            classId: 1,
            chapterId: 1,
            sequenceId: 1
        })
            .then(() => alert("전송되었습니다."))
            .catch((err) => console.log(err));
    };
    
    return(
        <div className='interaction'>

            {/*교사 화면*/}
            {role == 'ROLE_EDUCATOR' && <>
                <h4>교사 화면</h4>

                <div>
                    <label className='labelEducator'>공유할 대상 선택</label>
                    {managedStudents.elems &&
                        <div className='managedStudentContainer'>
                            {managedStudents.elems.map((elem, index) => (
                                <div key={index}>
                                    <label>
                                        <input 
                                            type="checkbox" 
                                            onChange={() => handleCheckbox(elem.studentUsername, elem.id)}
                                        />
                                        {elem.studentUsername}
                                    </label>
                                </div>
                            ))}
                        </div>
                    }   
                </div>

                <div>
                    <label className='labelEducator'>공유할 파일 업로드</label>
                    <input type="file" accept=".xlsx" onChange={handleExcelFileChange} />
                </div>

                <label className='labelEducator'>
                    파일 미리 보기
                </label>

                <table className='excelData-list'>
                    <thead>
                        <tr>
                            {excelData[0] && excelData[0].map((header, index) => {
                                if (header !== "empty") {
                                    return <th key={index}>{header}</th>
                                }
                                return null
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {excelData.slice(1).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div>
                    <label className='labelEducator'>메모</label>   
                    <textarea onChange={handleMemoChange}/>
                </div>


                <div style={{display: 'flex', justifyContent: 'center', marginTop: '3rem'}}>
                    <button className='shareFileBtn' onClick={handleSharing}>공유하기</button>
                </div>

                <div style={{display: 'flex', justifyContent: 'center', marginTop: '1rem'}}>
                    <Link to='/interaction2'>
                        <button className='shareFileBtn'>학생 데이터 조회하기</button>
                    </Link>
                </div>
            </>}
            
            {/*학생 화면*/}
            {role == 'ROLE_STUDENT' && <>
                <h4>학생 화면</h4>

                <div>
                    <button 
                        className='shareFileBtn' 
                        onClick={handleGetData}
                        style={{background: '#6CCC81'}}>공유 데이터 가져오기</button>
                </div>

                <label className='labelStudent'>공유된 데이터</label>

                {sharedData && sharedData.length > 0 && (
                    <table border="1" className='sharedData'>
                        <thead>
                            <tr>
                                {sharedData[0].properties.split(', ').map((property, index) => (
                                    <th key={index}>{property}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sharedData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.data.split(', ').map((cell, cellIndex) => (
                                        <td key={cellIndex}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div>
                    {sharedData && sharedData.length > 0 && (
                        <>
                            <label className='labelStudent'>저장 일시</label>
                            <p>{sharedData[0].saveDate}</p>

                            {sharedData[0].memo &&
                                <>
                                    <label className='labelStudent'>메모</label>
                                    <p>{sharedData[0].memo}</p>
                                </>
                            }
                        </>
                    )}
                </div>

                <div>
                    <label className='labelStudent'>데이터 값 수정하기</label>

                    {sharedData && sharedData.length > 0 && (
                        <table border="1" className='sharedData'>
                            <thead>
                                <tr>
                                    {sharedData[0].properties.split(', ').map((property, index) => (
                                        <th key={index}>
                                            <input
                                                value={properties[index]}
                                                onChange={(e) => handleHeaderChange(index, e.target.value)}
                                            />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                            {sharedData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                {row.data.split(', ').map((cell, cellIndex) => (
                                    <td key={cellIndex}>
                                        <input
                                            value={cellValues[rowIndex][cellIndex]}
                                            onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                                        />
                                    </td>
                                ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div style={{display: 'flex', justifyContent: 'center', marginTop: '3rem'}}>
                    <button className='shareFileBtn'  style={{background: '#6CCC81'}} onClick={handleModify}>전송하기</button>
                </div>
            </>}
        </div>
    )
}