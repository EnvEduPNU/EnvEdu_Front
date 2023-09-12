import { useState, useEffect } from 'react';
import '../OpenApi/OpenApi.scss';
import { customAxios } from '../Common/CustomAxios';
import MySeedData from './mySeedData';

import datas from './fakeDB.json';

export default function MyData() {
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

    function getMyData(type) {
        setCategory(type);
        let path = ''
        let username = localStorage.getItem('username');
        if (type === 'water') {
            path = '/ocean-quality/mine?username=' + username;
        } else if (type === 'air') {
            path = '/air-quality/mine?username=' + username;
        } 
        
        if (type === 'water' || type === 'air') {
            customAxios.get(path)
                .then((jsonData)=>{
                    jsonData = jsonData.data;
                    setData(jsonData);
                    setFilteredData(jsonData);
                    
                    // Set the table headers dynamically
                    const headers = Object.keys(jsonData[0]).filter((key) => key !== 'id' && key !== 'owner');
                    setHeaders(headers);
                });
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
    console.log(category)
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

            <table className='myData-list'>
                <thead>
                    <tr>
                        {Object.keys(datas[0]).map(key => (
                            <th key={key}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {datas.map(data => (
                        <tr key={data.id} onClick={() => getMyData(data.data)}>
                            {Object.values(data).map(value => (
                                <td key={value}>{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{marginTop: '1.875rem'}}>
                {category !== 'seed' && filteredData.length !== 0 && 
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
                {category === 'seed' && <MySeedData />}
            </div>
        </div>
    )
}