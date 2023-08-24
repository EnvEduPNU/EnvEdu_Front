import { useState, useEffect } from "react";
import './measure.scss';
import { customAxios } from '../../Common/CustomAxios';

export default function ContinuousSub(props) {
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
    }, [props.data, props.type, props.current]);
    
    /*기록하기*/
    const [recordedData, setRecordedData] = useState([]);

    const handleRecord = () => {
        const newRecord = {};
    
        dataTypes.forEach(dataType => {
            newRecord[dataType] = null;
        });
    
        props.selectedDataTypes.forEach(selectedType => {
            if (value[selectedType] !== -99999 && value[selectedType] !== undefined) {
                newRecord[selectedType] = value[selectedType];
            }
        });

        setRecordedData(prevRecords => [...prevRecords, newRecord]);
    };


    /*센서별 단위 설정*/
    {/*
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
    */}
    

    // n초 동안 m초 간격으로 저장
    const [wholeTime, setWholeTime] = useState(0); //n초
    const [interval, setInterv] = useState(0); //m초

    const handleStart = () => {
        let handleRecordIntervalId;
        if (props.selectedDataTypes.length === 0) {
            alert("센서를 1개 이상 선택해주세요.")
        } else {
            props.onRegister();

            // n초 동안
            setTimeout(() => {
                clearInterval(handleRecordIntervalId);
                alert("데이터 측정이 완료되었습니다. 측정한 값은 My data에서 확인 가능합니다.");
                console.log("완료");
                console.log(recordedData);
                /*
                // 데이터 저장
                customAxios.post('/user/save', recordedData)
                    .then((res) => console.log(res))
                    .catch((err) => console.log(err))
                */
                // disconnect 함수 추가
            }, wholeTime * 1000);

            //m초 간격으로
            handleRecordIntervalId = setInterval(() => {
                handleRecord();
                console.log("기록됨");
            }, interval * 1000);
        }
    };

    useEffect(() => {
        console.log(recordedData);
    }, [recordedData]);

    return(
        <div>
            <div style={{marginTop: '1rem'}}>
                {props.selectedDataTypes.map(selectedType => (
                    <span className="gray-span">  
                        <label>{dataTypes_ko[dataTypes.indexOf(selectedType)]}</label>
                        <span className="navy-span">{value[selectedType] === -99999 ? "N/A" : value[selectedType]}</span>
                    </span>
                ))}
                <button>dd</button>
            </div>
 
            <div style={{display: 'flex', alignItems: 'center', marginTop: '1rem'}}>
                <input type="number" onChange={(e) => {setWholeTime(parseInt(e.target.value))}} />초 동안
                <input type="number" onChange={(e) => {setInterv(parseInt(e.target.value))}} style={{marginLeft: '1rem'}}/>초 간격으로 저장
                <button onClick={handleStart}>확인</button>
            </div>

        </div>
    )
}