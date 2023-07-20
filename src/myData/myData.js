import { useState, useEffect } from "react";
import './myData.css';
import { Line } from 'react-chartjs-2';

import data from './data.json';

export default function MyData2() {
    const attribute_ko = ['측정 시간', '측정 위치', '소속', '습도', '기온', '탁도', 'pH', '미세먼지', '용존산소량', '이산화탄소', '조도', '토양 습도', '기압'];
    const attribute = ['measuredDate', 'location', 'unit', 'hum', 'temp', 'tur', 'ph', 'dust', 'dox', 'co2', 'lux', 'hum_EARTH', 'pre'];

    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [show, setShow] = useState(false);

    const handleStart = (date) => {
        if ((end !== null) && (new Date(end) < new Date(date))) alert("시작을 올바른 값으로 선택해주세요.")
        else setStart(date);
    }

    const handleEnd = (date) => {
        if (new Date(start) > new Date(date)) alert("끝을 올바른 값으로 선택해주세요.")
        else setEnd(date);
    }

    /* 선택한 범위 내의 data들 */
    const filteredData = data.filter((item) => {
        const measuredDate = new Date(item.measuredDate);
        return measuredDate >= new Date(start) && measuredDate <= new Date(end);
    });
    
    const sensorName = attribute.slice(3, attribute.length);
    const sensorName_ko = attribute_ko.slice(3, attribute_ko.length);
    //const sensorName = ['hum', 'temp', 'tur', 'ph', 'dust', 'dox', 'co2', 'lux', 'hum_EARTH', 'pre'];
    //const sensorName_ko = ['습도', '기온', '탁도', 'pH', '미세먼지', '용존산소량', '이산화탄소량', '조도', '토양 습도', '기압'];
    const borderColors = ["#f9d1d1", "#ffa4b6", "#f765a3", "#f91e79", "#d9baee", "#a155b9", "#165baa", "#0b1354", "#5b5b60", "#dcdcde"]

    let datasets = sensorName.map((key, index) => ({
        type: 'line',
        label: sensorName_ko[index],
        backgroundColor: borderColors[index],
        borderColor: borderColors[index],
        data: filteredData.map((item) => item[key]),
        borderWidth: 2
    }));

    let graphData =  {
        labels: filteredData.map((item) => item.measuredDate),
        datasets: datasets
    };

    const drawGraph = () => {
        if (start === null || end === null) alert("그래프 시작과 끝을 선택해주세요.")
        else {
            setShow(true);
        }
    }

    return(
        <div className='myData'>
            <div style={{
                display: 'flex',
                marginBottom: '1rem'
            }}>
                <label style={{fontWeight: 'bold'}}>원하는 구간 선택하기</label>
                <div className='startBtn'>시작</div>
                <div>{start}</div>
                <div className='endBtn' style={{marginLeft: '1rem'}}>끝</div>
                <div>{end}</div>
                <button className="drawGraph" onClick={drawGraph}>그래프 그리기</button>
            </div>
            <table>
                <thead>
                    <tr>
                        {attribute_ko.map((name) => (
                            <th key={name}>{name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                {data.map((item) => (
                    <tr key={item.id}>
                        {attribute.map((name) => (
                        <td key={name}>
                            {name === "measuredDate" ? (
                            <div style={{display: 'flex', 
                                        justifyContent: 'center',
                                        alignItems: 'center'}}>
                                {item[name]}
                                <div className='startBtn' 
                                    onClick={() => handleStart(item['measuredDate'])}>시작</div>
                                <div className='endBtn'
                                    onClick={() => handleEnd(item['measuredDate'])}>끝</div>
                            </div>
                            ) : (
                            item[name]
                            )}
                        </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            
            {show && 
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{marginTop: '3rem', width: '90%'}}>
                    <Line type="line" data={graphData}/>
                </div>
            </div>
            }
        </div>
    )
}