import { useState, useEffect } from 'react';
import '../OpenApi/OpenApi.scss';
import { customAxios } from '../Common/CustomAxios';
import MySeedData from './mySeedData';

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
        } 
        
        if (type === "수질 데이터" || type === "대기질 데이터") {
            customAxios.get(path)
                .then((res)=>{
                    console.log(res.data)
                    //const data = res.data.map(({ id, dataUUID, saveDate, ...rest }) => rest);
                    //console.log(data);
                    setData(res.data);
                    setFilteredData(res.data);
    
                    const headers = Object.keys(res.data[0]).filter(
                        (key) => key !== "id" && key !== "dataUUID" && key !== "saveDate"
                    );
                    setHeaders(headers);
                })
                .catch((err) => console.log(err));
        }
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
            "pm25Value": "미세먼지(PM2.5)  농도(㎍/㎥)"            
        };
        return kor[name] || "";
    }

    console.log(selectedItems) //데이터 삭제할 때 사용

    return(
        <div id="wrap-openapi-div">
            <h3>
                <img src="/assets/img/folder-icon.png"
                        style={{
                            width: '2rem', 
                            marginRight: '1rem'
                            }}/>
                저장한 데이터
            </h3>
            
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
                {category !== "SEED" && filteredData.length !== 0 && 
                    <table border="1" className='myData-list-detail'>
                        <thead>
                            <tr>
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
                            </tr>
                        </thead>
                        
                        <tbody>
                            {filteredData.map((item) => (
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
                }
                {category === 'SEED' && <MySeedData />}
            </div>

        </div>
    )
}