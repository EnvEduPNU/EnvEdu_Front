import { useState, useEffect } from 'react'
import { customAxios } from '../Common/CustomAxios';
import * as XLSX from 'xlsx';
import './interaction.scss';

export default function InterAction() {
    const [role, setRole] = useState(null);
    useEffect(() => {
        const user_role = localStorage.getItem("role");
        setRole(user_role);
    }, []);

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

    const [memo, setMemo] = useState('');

    const handleMemoChange = (e) => {
        setMemo(e.target.value);
    };

    const [code, setCode] = useState(null);
    const handleSharing = () => {
        customAxios.post('/dataLiteracy/inviteData', {
            properties: excelData[0], 
            data: excelData.slice(1),
            memo: memo
        })
            .then((res) => {
                alert("공유되었습니다.");
                setCode(res.data);
            })
            .catch((err) => console.log(err));
    }
    //console.log(excelData);

    const [codeInput, setCodeInput] = useState(null);
    const handleCode = (e) => {
        setCodeInput(e.target.value); 
    }

    const [sharedData, setSharedData] = useState(null);
    const handleSharedData = () => {
        customAxios.get(`/dataLiteracy/inviteData?inviteCode=${codeInput}`)
            .then((res) => {
                setSharedData(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
                alert("존재하지 않는 코드입니다.");
            })
    }

    return(
        <div className='interaction'>

            {/*교사 화면*/}
            {role == 'ROLE_EDUCATOR' && <>
                <h4>교사 화면</h4>

                <div>
                    <label className='labelEducator'>파일 업로드</label>
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

                {code &&
                    <div style={{display: 'flex', justifyContent: 'center', marginTop: '3rem'}}>
                        <span style={{color: '#FF7878', fontWeight: '600'}}>초대 코드 : {code}</span>
                    </div>
                }
            </>}
            
            {/*학생 화면*/}
            {role == 'ROLE_STUDENT' && <>
                <h4>학생 화면</h4>

                <div>
                    <label className='labelStudent'>초대 코드 입력하기</label>
                    <input className='inputForCode' onChange={handleCode} />
                    <button className='enterCodeBtn' onClick={handleSharedData}>확인</button>
                </div>

                <label className='labelStudent'>공유된 데이터</label>

                {sharedData && 
                    <table border="1" className='sharedData'>
                        <thead>
                            <tr>
                                {sharedData.properties.map((property, index) => (
                                    <th key={index}>{property}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sharedData.data.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }

                <div>
                    {sharedData &&
                        <>
                            {sharedData.memo &&
                                <>
                                    <label className='labelStudent'>메모</label>
                                    <p>{sharedData.memo}</p>
                                </>
                            }

                            <label className='labelStudent'>저장 일시</label>
                            <p>{sharedData.saveDate}</p>
                        </>
                    }
                </div>
            </>}
        </div>
    )
}