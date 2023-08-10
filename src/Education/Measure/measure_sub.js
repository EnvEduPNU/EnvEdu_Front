import { useState, useEffect } from "react";
import './measure.scss';

export default function MeasureSub(props) {
    const dataTypes = ["temp", "ph", "hum", "hum_EARTH", "tur", "dust", "dox", "co2", "lux", "pre"];
    const dataTypes_ko = ["기온", "pH", "습도", "토양 습도", "탁도", "미세먼지", "용존산소량", "이산화탄소 농도", "조도", "기압"]

    const [value, setValue] = useState(-99999);

    /**
     * 그래프를 렌더링하기 위한 데이터
     */
    const [graphData] = useState([]);

    useEffect(() => {
        /**
         * 유효하지 않은 데이터를 제외한 값을 이용해 그래프 생성
         * 컴포넌트가 처음 생성될 때 받았던 데이터 중 유효한 값을 graphData에 추가
         */
        if (dataTypes.includes(props.type)) {
            props.data.forEach((elem) => {
                const propValue = elem[props.type];
                if (propValue !== -99999) {
                    graphData.push(propValue);
                }
            });
        }
    }, [])

    useEffect(() => {
        /**
         * 데이터를 받았을 때, 유효한 값이면 마지막으로 받은 값 갱신
         * graphData에도 추가
         */
        const propKey = props.type;
    
        if (props.current !== null && props.current !== undefined) {
            const propValue = props.current[propKey];
            if (propValue !== -99999) {
                graphData.push(propValue);
            }
    
            const lastData = props.data[props.data.length - 1][propKey];
            setValue(lastData);
    
            if (graphData.length > 10) {
                graphData.splice(0, 1);
            }
        }
    }, [props.data, props.type, props.current]);

    /*기록하기*/
    const [recordedData, setRecordedData] = useState([]);
    const handleRecord = () => {
        if (value !== -99999) {
            const currentTime = new Date().toLocaleTimeString();
            const sensor = dataTypes_ko[dataTypes.indexOf(props.type)]
            const newRecord = {
                time: currentTime,
                sensor: sensor,
                item: props.item,
                value: `${value}${getUnitForType(props.type)}`
            };
            setRecordedData([...recordedData, newRecord]);
        }
    }
    console.log(props.type)
    //console.log(graphData);
    console.log(value);

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
    
    return(
        <div>
            {!props.enter && <>
                <label>측정값</label>
                <span>{value === -99999 ? "N/A" : value}</span>
                <button onClick={handleRecord}>
                    <img src='/assets/img/record.png' /> 기록하기
                </button>
            </>}

            {!props.enter &&
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
                                backgroundColor: selectedRows.includes(index) ? "rgba(255, 0, 0, 0.20)" : "#fff"
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
            }

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

        </div>
    )
}