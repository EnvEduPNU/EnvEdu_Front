import { useState } from "react"
import { customAxios } from "../../Common/CustomAxios"
import { useEffect } from "react";

export default function InterAction2() {
    const [customDataList, setCustomDataList] = useState([]);
    useEffect(() => {
        customAxios.get('/dataLiteracy/studentData?classId=1&chapterId=1&sequenceId=1')
            .then((res) => setCustomDataList(res.data))
            .catch((err) => console.log(err));
    }, []);

    // uuid가 같은 데이터끼리 묶기
    const groupedData = customDataList.reduce((acc, data) => {
        const existingGroup = acc.find(group => group.uuid === data.uuid);
    
        if (existingGroup) {
            existingGroup.data.push(data.data.split(', ').map(item => item.trim()));
        } else {
            acc.push({
                uuid: data.uuid,
                properties: data.properties,
                data: [data.data.split(', ').map(item => item.trim())], // 문자열을 배열로 변환
                memo: data.memo,
                saveDate: data.saveDate,
                username: data.username
            });
        }        
    
        return acc;
    }, []);

    const [filteredData, setFilteredData] = useState([]);
    const handleUUID = (uuid) => {
        const singleData = groupedData.filter((data) => data.uuid == uuid);
        setFilteredData(singleData);
    };

    return(
        <div className="interaction">
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <img src='/assets/img/blackboard.jpg' style={{width: '20%'}}/>
            </div>

            <div style={{display: 'flex', justifyContent: 'center', marginTop: '2rem'}}>
                {groupedData.map((data, index) => (
                    <div key={index}>
                        <img src='/assets/img/desk.png' style={{width: '20%'}} />
                        <span style={{margin: '0 1rem', fontWeight: '600'}}>{data.username}</span>
                        <span 
                            style={{background: '#d2d2d2', padding: '0.5rem', borderRadius: '0.3125rem', fontWeight: '600',cursor: 'pointer'}}
                            onClick={() => handleUUID(data.uuid)}>데이터 보기</span>
                    </div>
                ))}
            </div>

            <div>
                {filteredData[0] && 
                    <table border="1" className='excelData-list'>
                        <thead>
                            <tr>
                                {filteredData[0].properties.split(', ').map((property, index) => (
                                    <th key={index}>{property}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData[0].data.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }

            </div>
        </div>
    )
}