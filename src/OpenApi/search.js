import './OpenApi.css';
import './search.scss';
import { customAxios } from '../Common/CustomAxios';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Search() {
    const location = useLocation();
    const stationName = location.state ? location.state.stationName : null;
    
    const [stations, setStations] = useState([]);
    const [pastData, setPastData] = useState([]);

    const [headers, setHeaders] = useState([]);
    const [checkedHeaders, setCheckedHeaders] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isFull, setIsFull] = useState([]);

    useEffect(() => {
        if (location.state) {
            customAxios.get(`/air-quality/station?addr=${stationName}`)
            .then((res) => setStations(res.data))
            .catch((err) => console.log(err));

            customAxios.get(`/air-quality?stationName=${stationName}`)
            .then((res) => {
                console.log(res.data);
                setPastData(res.data);
                const checkedHeaders = Object.keys(res.data[0]).filter((key) => key !== 'id' && key !== 'PTNM');
                setCheckedHeaders(checkedHeaders);
            })
            .catch((err) => console.log(err));
        }
    }, []);

    {/*선택한 데이터 저장하기*/}
    const handleSaveMyData = async (e) => {
        e.preventDefault();
        customAxios.post('/air-quality', selectedItems)
        .then( () => {
            alert("데이터 저장을 성공했습니다!");
        })
        .catch((err) => {
            alert("데이터 저장을 실패했습니다.");
            console.log(err);
        });
    };

    function handleFullCheck() {
        setIsFull(!isFull)
        if (isFull)
            setSelectedItems([])
        else
            setSelectedItems(pastData)
    }

    function handleViewCheckBoxChange(item){
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    }

    function handlePropertyCheckboxChange(event) {
        const { name, checked } = event.target;
        if (checked) {
            setHeaders([...headers, name]);
        } else {
            setHeaders(headers.filter((header) => header !== name));
        }
    }

    //항목 이름 (한국어 -> 영어)
    const engToKor = (name) => {
        const kor = {
            //대기질 데이터
            "stationName": '조사지점명',
            "dataTime": "측정일",
            "so2Value": "아황산가스 농도(ppm)",
            "coValue": "일산화탄소 농도(ppm)",
            "o3Value": "오존 농도(ppm)",
            "no2Value": "이산화질소 농도(ppm)",
            "pm10Value": "미세먼지(PM10) 농도(㎍/㎥)",
            "pm25Value": "미세먼지(PM2.5)  농도(㎍/㎥)"            
        };
        return kor[name] || "";
    }

    return(
        <div>
            <h4>측정소 목록 조회</h4>
            {stationName ? (
                <p>
                    <span style={{ color: '#027c2b' }}>{stationName}</span>에 대한 검색 결과
                </p>
            ) : (
                ""
            )}

            {stations.map((station, index) => (
                <div key={index}>
                    측정소 위치 : {station.addr}
                </div>
            ))}

            <div style={{marginTop: '1rem'}}>
                <label className="filter-label">추가/삭제</label>
                <div 
                    style={{
                        margin: '0.625rem 0',
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        width: '100%'
                    }}>
                        {checkedHeaders.map((header) => (
                            <label key={header}>
                                <input
                                    type="checkbox"
                                    key={header}
                                    name={header}
                                    value={header}
                                    checked={headers.includes(header)}
                                    onChange={handlePropertyCheckboxChange}
                                />
                                {engToKor(header)}
                            </label>
                        ))}
                </div>
            </div>
                
            <div style={{
                display: 'flex', 
                justifyContent: 'flex-end'
            }}>
                <button 
                    id="table-btn" 
                    onClick={handleSaveMyData}
                    style={{marginRight: '0.3rem'}} >
                    데이터 저장하기
                </button>
            </div>

            <table border="1" className="openAPI-table">
                <thead>
                    {headers.map((header) => (
                        <th key={header}>{engToKor(header)}</th>
                    ))}
                    <th>
                        <input
                            type="checkbox"
                            onChange={() => handleFullCheck()}
                            checked={isFull}
                        ></input>
                    </th>
                </thead>
                <tbody>
                    {pastData.map((item) => (
                        <tr key={item.id}>
                            {headers.map((header) => (
                                <td key={header}>{item[header]}</td>
                            ))}
                            <td>
                                <input
                                    type="checkbox"
                                    name={item}
                                    checked={selectedItems.includes(item)}
                                    onChange={() => handleViewCheckBoxChange(item)}
                                ></input>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}