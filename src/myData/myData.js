import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../OpenApi/OpenApi.scss';
import { customAxios } from '../Common/CustomAxios';
import * as XLSX from 'xlsx';

export default function MyData() {
    const [summary, setSummary] = useState([]);

    useEffect(() => {
        customAxios.get('/mydata/list')
        .then((res) => {
            console.log(res.data)
            const formattedData = res.data.map(data => ({
                ...data,
                saveDate: new Date(data.saveDate).toLocaleString({
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }),
                dataLabel: data.dataLabel === "AIRQUALITY" ? "대기질 데이터" : (
                    data.dataLabel === "OCEANQUALITY" ? "수질 데이터" : data.dataLabel
                )
            }));
            setSummary(formattedData);
            console.log(formattedData)
        })
        .catch((err) => console.log(err))
    }, []);

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isFull, setIsFull] = useState(false);
    const [category, setCategory] = useState('');

    function handleFullCheck(){
        setIsFull(!isFull)
        if (isFull)
            setSelectedItems([])
        else
            setSelectedItems(data)
    }

    function handleViewCheckBoxChange(item) {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    }

    function getTable(type, id) {
        setCategory(type);
        let path = ''
        if (type === "수질 데이터") {
            path = `/ocean-quality/mine/chunk?dataUUID=${id}`;
        } else if (type === "대기질 데이터") {
            path = `/air-quality/mine/chunk?dataUUID=${id}`;
        } else if (type === "SEED") {
            path = `/seed/mine/chunk?dataUUID=${id}`;
        }
        
        customAxios.get(path)
            .then((res)=>{
                console.log(res.data)
                //const data = res.data.map(({ id, dataUUID, saveDate, ...rest }) => rest);
                //console.log(data);
                setData(res.data);
                setFilteredData(res.data);

                let headers = Object.keys(res.data[0]).filter(
                    (key) => key !== "id" && key !== "dataUUID" && key !== "saveDate" && key !== "dateString"
                );

                const attributesToCheck = [
                    "co2",
                    "dox",
                    "dust",
                    "hum",
                    "hum_EARTH",
                    "lux",
                    "ph",
                    "pre",
                    "temp",
                    "tur"  
                ];
                
                for (const attribute of attributesToCheck) {
                    const isAllZero = res.data.every(item => item[attribute] === 0);
                
                    if (isAllZero) {
                        headers = headers.filter(
                            (header) => header !== attribute
                        );
                        // 해당 속성이 모두 0일 때, headers에서 제거
                        //setHeaders(prevHeaders => prevHeaders.filter(header => header !== attribute));
                    }
                }
                
                
                setHeaders(headers);
            })
            .catch((err) => console.log(err));

    };

    //항목 이름 (한국어 -> 영어)
    const engToKor = (name) => {
        const kor = {
            //수질 데이터
            "PTNM": '조사지점명',
            "WMYR": '측정연도',
            "WMOD": '측정월',
            "ITEMTEMP": '수온(°C)',
            "ITEMPH": 'pH',
            "ITEMDOC": 'DO(㎎/L)',
            "ITEMBOD": 'BOD(㎎/L)',
            "ITEMCOD": 'COD(㎎/L)',
            "ITEMTN": '총질소(㎎/L)',
            "ITEMTP": '총인(㎎/L)',
            "ITEMTRANS": '투명도(㎎/L)',
            "ITEMCLOA": '클로로필-a(㎎/L)',
            "ITEMEC": '전기전도도(µS/㎝)',
            "ITEMTOC": 'TOC(㎎/L)',

            //대기질 데이터
            "stationName": '조사지점명',
            "dataTime": "측정일",
            "so2Value": "아황산가스 농도(ppm)",
            "coValue": "일산화탄소 농도(ppm)",
            "o3Value": "오존 농도(ppm)",
            "no2Value": "이산화질소 농도(ppm)",
            "pm10Value": "미세먼지(PM10) 농도(㎍/㎥)",
            "pm25Value": "미세먼지(PM2.5)  농도(㎍/㎥)",
            
            //SEED 데이터
            "measuredDate": "측정 시간",
            "location": "측정 장소",
            "unit" : "소속",
            "period" : "저장 주기",
            "username": "사용자명",
            "hum": "습도",
            "temp": "기온",
            "tur": "탁도",
            "ph": "pH",
            "dust": "미세먼지",
            "dox": "용존산소량",
            "co2": "이산화탄소",
            "lux": "조도",
            "hum_EARTH": "토양 습도",
            "pre": "기압"
        };
        return kor[name] || name;
    }

    console.log(selectedItems) //데이터 삭제할 때 사용

    const handleDownload = () => { 
        //const arr = [{ age: 10, gender: 'Male', name: "abc" }, {age: 10, gender: 'Male', name: "123"}, {age: 10, gender: 'Male'}];
        if (selectedItems.length === 0) {
            alert("엑셀 파일로 내보낼 데이터를 한 개 이상 선택해 주세요.")
        }
        else {
            const modifiedSelectedItems = selectedItems.map((item) => {
                const newItem = { };
              
                for (const key in item) {
                    newItem[engToKor(key)] = item[key];
                }
                
                delete newItem.dataUUID;
                delete newItem.id;
                delete newItem.dateString;

                return newItem;
            });

            const filename = window.prompt("파일명을 입력해 주세요.");
            if (filename !== null) {
                const ws = XLSX.utils.json_to_sheet(modifiedSelectedItems);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                XLSX.writeFile(wb, `${filename}.xlsx`);
            } else {
                alert("엑셀 파일명을 입력해 주세요.");
            }   
        }
    }

    return(
        <div id='wrap-openapi-div'>
            <h3>
                <img src="/assets/img/folder-icon.png"
                        style={{
                            width: '2rem', 
                            marginRight: '1rem'
                            }}/>
                저장한 데이터
            </h3>
            
            <div style={{marginBottom: '0.5rem'}}>
                <Link to="/readExcel">엑셀 파일 업로드</Link>
            </div>
            
            {summary.length > 0 &&
                <table className='myData-list'>
                    <thead>
                        <tr>
                            {/*
                            {Object.keys(newData[0]).map(key => (
                                <th key={key}>{key}</th>
                            ))}
                            */}
                            <th key="id">id</th>
                            <th key="saveDate">저장 일시</th>
                            <th key="dataLabel">데이터 종류</th>
                            <th key="dataSize">데이터 크기</th>
                            <th key="memo">메모</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summary.map(data => (
                            <tr key={data.id} onClick={() => getTable(data.dataLabel, data.dataUUID)}>
                                {Object.entries(data).map(([key, value]) => {
                                    if (key !== "dataUUID") {
                                        return <td key={key}>{value}</td>;
                                    }
                                    return null; 
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            }

            <div style={{marginTop: '1.875rem'}}>
                {filteredData.length !== 0 && 
                    <>
                        <table border="1" className='myData-list-detail'>
                            <thead>
                                <tr>
                                    {headers.map((header) => (
                                        <th key={header}>{engToKor(header)}</th>
                                    ))}
                                    {/*{category !== "SEED" && */}
                                    <th>
                                        <input
                                            type="checkbox"
                                            onChange={() => handleFullCheck()}
                                            checked={isFull}
                                        ></input>
                                    </th>
                                </tr>
                            </thead>
                            
                            <tbody>
                                {filteredData.map((item) => (
                                    <tr key={item.id}>
                                        {headers.map((header) => (
                                            <td key={header}>{item[header]}</td>
                                        ))}
                                        {/*{category !== "SEED" && */}
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

                        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem'}}>
                            <button 
                                style={{border: 'none', backgroundColor: '#f3b634', fontWeight: '600', borderRadius: '1.25rem'}}
                                onClick={() => handleDownload()}>
                                    엑셀 파일로 저장
                            </button>
                        </div>
                    </>
                }
            </div>

        </div>
    )
}