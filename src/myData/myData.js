import React, {useState} from "react";
import {customAxios} from "../Common/CustomAxios";
import earthImg from "../OpenApi/earth.png";
import '../OpenApi/OpenApi.scss';
import MySeedData from "./mySeedData";
import { useEffect } from "react";

function MyData(){
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isFull, setIsFull] = useState(false);
    const [category, setCategory] = useState('water');

    useEffect(() => {
        getMyData('water');
    }, []);

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

        customAxios.get(path)
            .then((jsonData)=>{
                jsonData = jsonData.data;
                setData(jsonData);
                setFilteredData(jsonData);
                
                // Set the table headers dynamically
                const headers = Object.keys(jsonData[0]).filter((key) => key !== 'id' && key !== 'owner');
                setHeaders(headers);
            });
    };

    const changeStyle = (selectedCategory) => {
        return {
            backgroundColor: category === selectedCategory ? '#fff' : '#23273D',
            color: category === selectedCategory ? '#23273D' : '#fff',
            border: category === selectedCategory ? '2px solid #23273D' : 'none'
        };
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

    return (
        <div id="wrap-openapi-div">
            <h3>
                <img src={earthImg} 
                        style={{
                            width: '3.125rem', 
                            marginRight: '0.625rem'
                            }}/>
                저장한 데이터
                {category === "water" && " [수질]"}
                {category === "air" && " [대기질]"}
                {category === "seed" && " [SEED]"}
            </h3>

            <div className="wrap-select-type">
                <div 
                    className="select-type" 
                    onClick={() => getMyData('water')}
                    style={changeStyle('water')}>
                    수질 데이터
                </div>
                <div 
                    className="select-type" 
                    onClick={() => getMyData('air')}
                    style={changeStyle('air')}>
                    대기질 데이터
                </div>
                <div 
                    className="select-type" 
                    onClick={() => setCategory('seed')}
                    style={changeStyle('seed')}>
                    SEED
                </div>
            </div>

            
            <div style={{marginTop: '1.875rem'}}>
                {category !== 'seed' && filteredData.length !== 0 && 
                    <table border="1" className="myData-table">
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
    );
}
export default MyData;