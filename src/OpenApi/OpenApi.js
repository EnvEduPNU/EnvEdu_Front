import React, { useState, useEffect } from 'react';
import './OpenApi.css';
import {customAxios} from "../Common/CustomAxios";
import earthImg from "./earth.png"

//추후 삭제 필요
import waterdata from "./data.json" ;
import airdata from "./data2.json";

//그래프 그리기
import { Chart } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

//로딩 시간 줄이려면 useEffect로 미리 res.data 다 받아온 다음에 
//'수질', '대기질' 중 선택하는 항목에 따라 다른 component 보여줘야 함

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

    const [koHeaders, setKoHeaders] = useState([]);
    
    //최초 화면 렌더링 시 '수질 데이터' 조회
    useEffect(() => {
        handleButtonClickOcean();
    }, [])

    const handleButtonClickOcean = () => {
        //customAxios.get('/ocean-quality?location=부산')
            //.then((jsonData) => {
                //jsonData = jsonData.data;
                const jsonData = waterdata;
                setData(jsonData);
                setFilteredData(jsonData);
                setSelectedOption(null);
                //setSelectedOption(jsonData[0]);
                setIsFull(false);
                setIsShow(true);
                setSelectedItems([])
                setCategory("OCEAN")

                setKoHeaders(['조사지점명', '측정연도', '측정월', '수온', 'pH', '용존산소', '생물화학적산소요구량', '화학적산소요구량', '총질소', '총인', '투명도', '클로로필-a', '전기전도도', '총유기탄소']);
                // Set the table headers dynamically
                const headers = Object.keys(jsonData[0]).filter((key) => key !== 'id' && key !== 'PTNM');
                setHeaders(headers);
                const checkedHeaders = Object.keys(jsonData[0]).filter((key) => key !== 'id' && key !== 'PTNM');
                setCheckedHeaders(checkedHeaders);
            //});

    };
    const handleButtonClickAir = () => {
        //customAxios.get('/air-quality?location=부산')
            //.then((jsonData) => {
                //jsonData = jsonData.data;
                const jsonData = airdata;
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
            //});                   
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

    {/*
    function modalClick(){
        setShowModal(!showModal);
    }
    */}

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
    function handleFullLookup() {
        setSelectedOption(null);
        setFilteredData(data);
        setSelectedItems([]);
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

    /*그래프 그리기 */
    console.log(selectedItems);
    const graphLabel = selectedItems.map((selectedItem) => selectedItem.stationName);
    const oceanData_ITEMCOD = selectedItems.map((selectedItem) => selectedItem.ITEMCOD);
    const oceanData_ITEMDOC = selectedItems.map((selectedItem) => selectedItem.ITEMDOC);
    //const airData = selectedItems.map((selectedItem) => selectedItem.pm10Value);

    /* useEffect 사용하거나 버튼 살려서 완성하기 */
    if (category === 'OCEAN') {

    } else if (category === 'AIR') {

    }
    
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

    /*
    const drawGraph = () => {
        if (graphLabel.length === 0) {
            alert("데이터를 선택해주세요");
        } else {
            
        }
    }
    */

    console.log(category)

    return (
        <div style={{margin: 'auto'}}>
            <div id="wrap-openapi-div">
                {/*
                <div className={showModal ? 'modal-full' : ''} onClick={modalClick} style={{background: 'pink'}}></div>
                {showModal &&
                    <div className="modal-table">
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        {headers.map((header) => (
                                            <th key={header} onClick={modalClick}>{header}</th>
                                        ))}
                                        <th>확인</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(selectedItem).map((value, index) => (
                                        <td key={index} onClick={modalClick}>{value}</td>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
                */}
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
                                    {header}
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
                    {/*
                    <button 
                        id="table-btn"
                        onClick={drawGraph}>
                        그래프 그리기
                    </button>
                    */}
                </div>

                <table border="1" className="openAPI-table">
                    <thead>
                        {headers.map((header) => (
                            <th key={header}>{header}</th>
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
