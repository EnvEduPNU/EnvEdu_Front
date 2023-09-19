import * as XLSX from 'xlsx';
import { useState } from 'react';
import './readExcel.scss';

export default function ReadExcel() {
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
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            setExcelData(data);
            console.log(data)
        };
    };
  
    const handleExcelFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            readExcel(file);
        }
    };
console.log(excelData)
    return(
        <div className='read-excel-container'>
            <div style={{display: 'flex', marginBottom: '2rem'}}>
                <label>데이터 종류</label>
                <input className='dataLabel'></input>
            </div>

            <div style={{display: 'flex', marginBottom: '2rem'}}>
                <label>파일 업로드</label>
                <input type="file" accept=".xlsx" onChange={handleExcelFileChange} />
            </div>
            
            <label style={{marginBottom: '0.5rem'}}>
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
            
            <div style={{display: 'flex', justifyContent: 'flex-end', fontWeight: '600', marginTop: '0.5rem'}}>
                {excelData.length > 0 && <span>데이터 크기 : {excelData.length - 1}</span>}
            </div>

            <div style={{display: 'flex', marginTop: '1rem', marginBottom: '0.5rem'}}>
                <label>메모</label>   
                <textarea />
            </div>
            

            <div style={{display: 'flex', justifyContent: 'center', marginTop: '3rem'}}>
                <button className='save-file-btn'>저장하기</button>
            </div>
            
        </div>
    )
}