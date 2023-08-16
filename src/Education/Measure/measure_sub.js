import { useState, useEffect } from "react";
import './measure.scss';

export default function MeasureSub(props) {
    const dataTypes = ["temp", "ph", "hum", "hum_EARTH", "tur", "dust", "dox", "co2", "lux", "pre"];
    const dataTypes_ko = ["기온", "pH", "습도", "토양 습도", "탁도", "미세먼지", "용존산소량", "이산화탄소 농도", "조도", "기압"]

    const [value, setValue] = useState({
        "temp": -99999,
        "ph": -99999,
        "hum": -99999,
        "hum_EARTH": -99999,
        "tur": -99999, 
        "dust": -99999, 
        "dox": -99999, 
        "co2": -99999,
        "lux": -99999,
        "pre": -99999 
    });

    useEffect(() => {
        /*
        데이터를 받았을 때, 유효한 값이면 마지막으로 받은 값 갱신
         */
        const propKeys = props.selectedDataTypes;
        const newValues = {};
    
        if (props.current !== null && props.current !== undefined) {
            propKeys.forEach(key => {
                const lastData = props.data[props.data.length - 1][key];
                newValues[key] = lastData;
            });
            setValue(newValues);
        }
        console.log(newValues)
    }, [props.data, props.type, props.current]);
    console.log(value)
    
    /*기록하기*/
    const [recordedData, setRecordedData] = useState([]);

    const handleRecord = () => {
        const currentTime = new Date().toLocaleTimeString();
        //const recordedValues = [];

        props.selectedDataTypes.forEach(selectedType => {
            if (value[selectedType] !== -99999) {
                const sensor = dataTypes_ko[dataTypes.indexOf(selectedType)];
                const newRecord = {
                    time: currentTime,
                    sensor: sensor,
                    item: props.item,
                    value: `${value[selectedType]}${getUnitForType(selectedType)}`
                };
                //recordedValues.push(newRecord);
                setRecordedData([...recordedData, newRecord]);
            }
        });
    };

    /*센서별 단위 설정*/
    const getUnitForType = (type) => {
        const units = {
          "temp": "°C",
          "ph": "",
          "hum": "%",
          "tur": "NTU",
          "dust": "μg/m³",
          "dox": "mg/L",
          "co2": "ppm",
          "lux": "lx",
          "pre": "hPa"
        };
        return units[type] || "";
    };
    
    // + 버튼 누르면 row 추가
    const [divCount, setDivCount] = useState(0);

    const addDiv = () => {
        setDivCount(prevCount => prevCount + 1);
    };

    // 저장 버튼 누르면 해당 row의 background 색 변경
    const [selectedRows, setSelectedRows] = useState([]);

    const handleCheckboxChange = (index) => {
        if (selectedRows.includes(index)) {
            setSelectedRows(selectedRows.filter((rowIndex) => rowIndex !== index));
        } else {
            setSelectedRows([...selectedRows, index]);
        }
    };
    console.log(props.selectedDataTypes)

    return(
        <div>
            <div style={{marginTop: '1rem'}}>
                {props.selectedDataTypes.map(selectedType => (
                    <span className="gray-span">  
                        <label>{dataTypes_ko[dataTypes.indexOf(selectedType)]}</label>
                        <span className="navy-span">{value[selectedType] === -99999 ? "N/A" : value[selectedType]}</span>
                    </span>
                ))}
                <button onClick={handleRecord}>
                    <img src='/assets/img/record.png' /> 기록하기
                </button>
            </div>

            <table className="measure-table">
                <thead>
                    <tr>
                        <th>측정 시간</th>
                        <th>센서명</th>
                        <th>측정 항목/장소</th>
                        <th>측정값</th>
                        <th>저장</th>
                    </tr>
                </thead>
                <tbody>
                    {recordedData.map((record, index) => (
                        <tr
                            key={index}
                            style={{
                            backgroundColor: selectedRows.includes(index) ? "#FFE8FB" : "#fff"
                            }}
                        >
                            <td>{record.time}</td>
                            <td>{record.sensor}</td>
                            <td>{record.item}</td>
                            <td>{record.value}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedRows.includes(index)}
                                    onChange={() => handleCheckboxChange(index)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/*직접 입력
            {props.enter && 
                <table className="measure-table">
                    <thead>
                        <tr>
                            <th>측정 시간</th>
                            <th>센서명</th>
                            <th>측정 항목/장소</th>
                            <th>측정값</th>
                            <th>저장</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="date" /> <input type="time" /></td>
                            <td>
                                <select>
                                    {dataTypes_ko.map((dataType) => (
                                        <option key={dataType}>{dataType}</option>
                                    ))}
                                </select>
                            </td>
                            <td><input /></td>
                            <td><input /></td>
                            <td>
                                <input
                                    type="checkbox"
                                />
                            </td>
                        </tr>

                        {Array.from({ length: divCount }, (_, index) => (
                            <tr key={index}>
                                <td><input type="date" /> <input type="time" /></td>
                                <td>
                                    <select>
                                        {dataTypes_ko.map((dataType) => (
                                            <option key={dataType}>{dataType}</option>
                                        ))}
                                    </select>
                                </td>
                                <td><input /></td>
                                <td><input /></td>
                                <td>
                                    <input
                                        type="checkbox"
                                    />
                                </td>
                            </tr>
                        ))}

                        <tr>
                            <td colSpan="5" style={{paddingBottom: '1rem', background: '#fff'}}>
                                <button onClick={addDiv} className="add-row">+</button>
                            </td>
                        </tr>
                    </tbody>
                </table>}
            */}

        </div>
    )
}