import React, { useState, useEffect } from 'react';
import './OpenApi.css';
import {customAxios} from "../Common/CustomAxios";
import { Link } from 'react-router-dom';
import { Chart } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

function Water() {
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [checkedHeaders, setCheckedHeaders] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isFull, setIsFull] = useState([]);
    const [isShow, setIsShow] = useState(false);
    
    //최초 화면 렌더링 시 '수질 데이터' 조회
    useEffect(() => {
        customAxios.get('/ocean-quality?location=부산')
            .then((jsonData) => {
                jsonData = jsonData.data;
                setData(jsonData);
                setFilteredData(jsonData);
                setSelectedOption(null);
                setIsFull(false);
                setIsShow(true);
                setSelectedItems([]);
                
                // Set the table headers dynamically
                const headers = Object.keys(jsonData[0]).filter((key) => key !== 'id');
                setHeaders(headers);
                const checkedHeaders = Object.keys(jsonData[0]).filter((key) => key !== 'id');
                setCheckedHeaders(checkedHeaders);
            });
    }, []);

    const options = data.map((station) => ({
        value: station.PTNM,
        label: station.PTNM,
    }));

    {/*선택한 데이터 저장하기*/}
    const handleSaveMyData = async (e) => {
        e.preventDefault();
        customAxios.post('/ocean-quality', selectedItems)
        .then( () => {
            alert("데이터 저장을 성공했습니다!");
        })
        .catch((err) => {
            alert("데이터 저장을 실패했습니다.");
            console.log(err);
        });
    };

    {/* 필터링을 위해 addr 선택 */}
    function handleSelectChange (e) {
        if (e.target.value === '전체') {
            setSelectedOption(null);
            setFilteredData(data);
            setSelectedItems([]);
        } else {
            const selectedStation = data.find((singleData) => singleData.PTNM === e.target.value);
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

    /*그래프 그리기 (수정 필요)*/
    console.log(selectedItems);
    const graphLabel = selectedItems.map((selectedItem) => selectedItem.PTNM);
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
        };
        return kor[name] || "";
    }

    return (
        <div>
            <div id="wrap-openapi-div">
                <div style={{marginTop: '1.875rem'}}> 
                    <label className="filter-label" style={{marginRight: '0.625rem'}}>조사 지점 필터링</label>
                    <select
                        value={selectedOption ? selectedOption.PTNM : ''}
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
                
                {/*                       
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
                */}
                
            </div>
        </div>
    );
}
export default Water;
