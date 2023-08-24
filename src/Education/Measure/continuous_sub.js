import { useState, useEffect } from "react";
import './measure.scss';
import { customAxios } from '../../Common/CustomAxios';
import { Chart } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

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
    const [graphData, setGraphData] = useState({});

    const handleRecord = () => {
        const newRecord = {};

        dataTypes.forEach(dataType => {
            newRecord[dataType] = null;
        });

        props.selectedDataTypes.forEach(selectedType => {
            if (value[selectedType] !== -99999 && value[selectedType] !== undefined) {
                const lastData = props.data[props.data.length - 1][selectedType];
                if (lastData !== -99999 && lastData !== undefined) {
                    newRecord[selectedType] = lastData;
                    setGraphData(prevGraphData => ({
                        ...prevGraphData,
                        [selectedType]: [...(prevGraphData[selectedType] || []), lastData]
                    }));
                }
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
    
    // 측정하는 동안 빨간색 버튼 blink
    const [isRecording, setIsRecording] = useState(false);

    // n초 동안 m초 간격으로 저장
    const [wholeTime, setWholeTime] = useState(0); //n초
    const [interval, setInterv] = useState(0); //m초

    const handleSave = () => {
        setGraphData({});
        if (props.selectedDataTypes.length === 0) {
            alert("센서를 1개 이상 선택해주세요.")
        } else {
            props.onRegister();

            //m초 간격으로
            const handleRecordIntervalId = setInterval(() => {
                handleRecord();
                setIsRecording(true);
            }, interval * 1000);

            // n초 동안
            setTimeout(() => {
                clearInterval(handleRecordIntervalId);
                setIsRecording(false);
                alert("데이터 측정이 완료되었습니다. 측정한 값은 My data에서 확인 가능합니다.");
                console.log("완료");
                console.log("저장 전 recordedData:", recordedData);
                
                // 데이터 저장
                customAxios.post('/user/save', {data: JSON.stringify(recordedData)})
                .then((res) => {
                    console.log(res.data);
                    console.log(JSON.stringify(recordedData));
                })
                .catch((err) => {
                    console.log(err);
                    console.log(JSON.stringify(recordedData));
                })

                setRecordedData([]);
                setGraphData({});
            }, wholeTime * 1000 + 10);
        } 
    };

    useEffect(() => {
        console.log(recordedData);
    }, [recordedData]);

    useEffect(() => {
        console.log(value);
    }, [value]);

    useEffect(() => {
        console.log(graphData);
    }, [graphData]);

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
                <button onClick={handleSave}>저장 시작</button> 
            </div>

            <div>
                <img src="/assets/img/record.png" className={isRecording ? "blink" : "not-blink"} />REC
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {props.selectedDataTypes.map((selectedDataType) => (
                    <div key={selectedDataType} style={{ width: '50%', marginBottom: '0.5rem'}}>
                        <Line
                            data={{
                            labels: Array.from(
                                { length: graphData[selectedDataType]?.length || 0 },
                                (_, i) => i + 1
                            ),
                            datasets: [
                                {
                                type: 'line',
                                label: dataTypes_ko[dataTypes.indexOf(selectedDataType)],
                                data: graphData[selectedDataType],
                                borderColor: '#EE2E31',
                                backgroundColor: '#F18486',
                                },
                            ],
                            }}
                        />
                    </div>
                ))}
            </div>

        </div>
    )
}