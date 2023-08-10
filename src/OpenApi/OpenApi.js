import React, { useState, useEffect } from 'react';
import './OpenApi.css';
import {customAxios} from "../Common/CustomAxios";
import earthImg from "./earth.png"
import { Chart } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

function OpenApi() {
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [checkedHeaders, setCheckedHeaders] = useState([]);
    //const [showModal, setShowModal] = useState(false);
    //const [selectedItem, setSelectedItem] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isFull, setIsFull] = useState([]);
    const [isShow, setIsShow] = useState(false);
    const [category, setCategory] = useState('');
    
    //최초 화면 렌더링 시 '수질 데이터' 조회
    useEffect(() => {
        handleButtonClickOcean();
    }, [])

    const handleButtonClickOcean = () => {
        customAxios.get('/ocean-quality?location=부산')
            .then((jsonData) => {
                jsonData = jsonData.data;
                setData(jsonData);
                setFilteredData(jsonData);
                setSelectedOption(null);
                //setSelectedOption(jsonData[0]);
                setIsFull(false);
                setIsShow(true);
                setSelectedItems([])
                setCategory("OCEAN")
                // Set the table headers dynamically
                const headers = Object.keys(jsonData[0]).filter((key) => key !== 'id' && key !== 'PTNM');
                setHeaders(headers);
                const checkedHeaders = Object.keys(jsonData[0]).filter((key) => key !== 'id' && key !== 'PTNM');
                setCheckedHeaders(checkedHeaders);
            });
    };

    const handleButtonClickAir = () => {
        customAxios.get('/air-quality?location=부산')
            .then((jsonData) => {
                jsonData = jsonData.data;
                setData(jsonData);
                setFilteredData(jsonData);
                setSelectedOption(null);
                //setSelectedOption(jsonData[0]);
                setIsFull(false);
                setIsShow(true);
                setSelectedItems([])
                setCategory("AIR")

                // Set the table headers dynamically
                const headers = Object.keys(jsonData[0]).filter((key) => key !== 'id' && key !== 'PTNM');
                setHeaders(headers);
                const checkedHeaders = Object.keys(jsonData[0]).filter((key) => key !== 'id' && key !== 'PTNM');
                setCheckedHeaders(checkedHeaders);
            });                   
    };

    const options = data.map((station) => ({
        value: station.stationName,
        label: station.stationName,
    }));

    {/*선택한 데이터 저장하기*/}
    const handleSaveMyData = async (e) => {
        e.preventDefault();
        let path = ''
        if (category === 'AIR') {
            path = '/air-quality';
        } else if (category === 'OCEAN') {
            path = '/ocean-quality';
        }
        customAxios.post(path, selectedItems)
        .then( () => {
            alert("데이터 저장을 성공했습니다!");
        })
        .catch(() => {
            alert("데이터 저장을 실패했습니다.");
        });
    };

    {/* 필터링을 위해 addr 선택 */}
    function handleSelectChange (e) {
        if (e.target.value === '전체') {
            setSelectedOption(null);
            setFilteredData(data);
            setSelectedItems([]);
        } else {
            const selectedStation = data.find((singleData) => singleData.stationName === e.target.value);
            setSelectedOption(selectedStation);
            setFilteredData([selectedStation]);
        }
    }

    function handleFullCheck(){
        setIsFull(!isFull)
        if (isFull)
            setSelectedItems([])
        else
            setSelectedItems(data)
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

    /*그래프 그리기 (수정 필요*/
    console.log(selectedItems);
    const graphLabel = selectedItems.map((selectedItem) => selectedItem.stationName);
    const oceanData_ITEMCOD = selectedItems.map((selectedItem) => selectedItem.ITEMCOD);
    const oceanData_ITEMDOC = selectedItems.map((selectedItem) => selectedItem.ITEMDOC);
    
    let sample = {
        labels: graphLabel,
        datasets: [
          {
            type: 'bar',
            label: 'ITEMCOD',
            backgroundColor: '#8bc34a',
            data: oceanData_ITEMCOD
          },
          {
            type: 'bar',
            label: 'ITEMDOC',
            backgroundColor: '#558b2f',
            data: oceanData_ITEMDOC,
          },
        ],
      };

    //항목 이름 (한국어 -> 영어)
    const engToKor = (name) => {
        const kor = {
            //수질 데이터
            "stationName": '조사지점명',
            "PTNM": '조사지점명',
            "WMYR": '측정연도',
            "WMOD": '측정월',
            "ITEMTEMP": '수온(°C)',
            "ITEMPH": 'pH',
            "ITEMDOC": '용존산소(㎎/L)',
            "ITEMBOD": '생물화학적산소요구량(㎎/L)',
            "ITEMCOD": '화학적산소요구량(㎎/L)',
            "ITEMTN": '총질소(㎎/L)',
            "ITEMTP": '총인(㎎/L)',
            "ITEMTRANS": '투명도(㎎/L)',
            "ITEMCLOA": '클로로필-a(㎎/L)',
            "ITEMEC": '전기전도도(µS/㎝)',
            "ITEMTOC": '총유기탄소(㎎/L)',

            //대기질 데이터
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

    return (
        <div style={{margin: 'auto'}}>
            <div id="wrap-openapi-div">
                <h3 className="air-div-full">
                    <img src={earthImg} 
                        style={{
                            width: '3.125rem', 
                            marginRight: '0.625rem'
                            }}/>
                    부산 수질/대기질 데이터 조회
                </h3>

                <div className="wrap-select-type">
                    <div onClick={handleButtonClickOcean} className="select-type">
                        <span>수질 데이터 조회</span>
                    </div>
                    <div onClick={handleButtonClickAir} className="select-type">
                        <span>대기질 데이터 조회</span>
                    </div>
                </div>
            
                <div style={{marginTop: '1.875rem'}}> 
                    <label className="filter-label" style={{marginRight: '0.625rem'}}>조사 지점 필터링</label>
                    <select
                        value={selectedOption ? selectedOption.stationName : ''}
                        onChange={handleSelectChange}
                        className="air-buttons"
                    >   
                        <option key="전체" value="전체">전체</option>
                        {options.map((option) => (
                            <option key={option.id} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

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
                        {isShow &&
                            <th>
                                <input
                                    type="checkbox"
                                    onChange={() => handleFullCheck()}
                                    checked={isFull}
                                ></input>
                            </th>
                        }
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

                <div style={{
                    marginTop: '1.875rem',
                    display: 'flex',
                    justifyContent: 'center'
                    }}>                  
                    <div style={{
                        width: '50%'
                        }}>
                        <Line type="line" data={sample} />
                    </div>
                </div>
                
            </div>
        </div>
    );
}
export default OpenApi;
