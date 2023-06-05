import React, { useState } from 'react';
import './OpenApi.css';
import {customAxios} from "../Common/CustomAxios";


function OpenApi() {
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [checkedHeaders, setCheckedHeaders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isFull, setIsFull] = useState([]);
    const [isShow, setIsShow] = useState(false);
    const [category, setCategory] = useState(false);

    const handleButtonClickOcean = () => {
        customAxios.get('/ocean-quality?location=부산')
            .then((jsonData) => {
                jsonData = jsonData.data;
                setData(jsonData);
                setFilteredData(jsonData);
                setSelectedOption(jsonData[0]);
                setIsFull(false);
                setIsShow(true);
                setSelectedItems([])
                setCategory("OCEAN")

                // Set the table headers dynamically
                const headers = Object.keys(jsonData[0]).filter((key) => key !== 'id');
                setHeaders(headers);
                const checkedHeaders = Object.keys(jsonData[0]).filter((key) => key !== 'id');
                setCheckedHeaders(checkedHeaders);
            });

    };
    const handleButtonClickAir = () => {
        customAxios.get('/air-quality?location=부산')
            .then((jsonData) => {
                jsonData = jsonData.data;
                setData(jsonData);
                setFilteredData(jsonData);
                setSelectedOption(jsonData[0]);
                setIsFull(false);
                setIsShow(true);
                setSelectedItems([])
                setCategory("AIR")

                // Set the table headers dynamically
                const headers = Object.keys(jsonData[0]).filter((key) => key !== 'id');
                setHeaders(headers);
                const checkedHeaders = Object.keys(jsonData[0]).filter((key) => key !== 'id');
                setCheckedHeaders(checkedHeaders);
            });

    };

    function redirectToExternalUrl(url, values) {
        const form = document.createElement('form');
        form.method = 'post';
        form.action = url;

        Object.keys(values).forEach((key) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = Array.isArray(values[key]) ? JSON.stringify(values[key]) : values[key];
            form.appendChild(input);
        });

        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.body.appendChild(form);
            form.submit();
        }
        //window.open("http://localhost:8080/chart", "", "_blank");
    }


    const options = data.map((station) => ({
        value: station.stationName,
        label: station.stationName,
    }));

    function handleThClick(header){
        const values = selectedItems.reduce((arr, user) => { // create a new array that contains only the values of the specified key for all objects in the array
            if (user.hasOwnProperty(header)) { // check if the key exists in the current object
                arr.push(user[header]); // add the value of the key to the array
            }
            return arr;
        }, []);
        redirectToExternalUrl("http://localhost:8080/chart", values)
        return values;
    }
    const handleSaveMyData = async (event) => {
        event.preventDefault();

        let path = ''
        if (category === 'AIR')
            path = '/air-quality';
        else if (category === 'OCEAN')
            path = '/ocean-quality';


        customAxios.post(path,selectedItems).then( (response) => {
            alert("데이터 저장을 성공했습니다!");
        })
        .catch(function (error) {
            alert("데이터 저장을 실패했습니다.");
        });
    };

    function modalClick(){
        setShowModal(!showModal);
    }

    function handleFiltering(){
        setFilteredData(selectedItems);
    }

    function handleSelectChange(event) {
        const selectedStation = data.find(
            (station) => station.stationName === event.target.value
        );
        setSelectedOption(selectedStation);
        setFilteredData([selectedStation]);
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

    return (
        <div id="wrap-air-div">
            <div className={showModal ? 'modal-full' : ''} onClick={modalClick}></div>
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
            <div className="wrap-select-type">
                <div onClick={handleButtonClickOcean} className="select-type">
                    <span>수질 데이터 조회</span>
                </div>
                <div onClick={handleButtonClickAir} className="select-type">
                    <span>대기질 데이터 조회</span>
                </div>
                {/* Render the rest of the component */}
            </div>
            <h3 className="air-div-full">부산 환경 상태</h3>

            {isShow &&
                <select
                    value={selectedOption ? selectedOption.stationName : ''}
                    onChange={handleSelectChange}
                    className="air-buttons"
                >
                    {options.map((option) => (
                        <option key={option.id} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            }
            {isShow &&
                <button
                    onClick={handleFullLookup}
                    id="full-lookup-button"
                    className="air-buttons"
                >
                    전체 조회
                </button>
            }
            {isShow &&
                <div id="selected-location">
                    {selectedOption ? selectedOption.stationName : '전체 조회'}
                </div>
            }
            {isShow &&
                <div id="search-checked"
                    onClick={handleFiltering}>
                    filtering
                </div>
            }
            {isShow &&
                <div id="save-my-data"
                     onClick={handleSaveMyData}>
                    Save My Data
                </div>
            }
            <div id="div-headers">
                {checkedHeaders.map((header) => (
                    <label key={header}>
                        <input
                            type="checkbox"
                            name={header}
                            value={header}
                            checked={headers.includes(header)}
                            onChange={handlePropertyCheckboxChange}
                        />
                        {header}
                    </label>
                ))}
            </div>

            <table border="1" className="air-div-full">
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th key={header} onClick={()=> handleThClick(header)}>{header}</th>
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
        </div>
    );
}

export default OpenApi;
