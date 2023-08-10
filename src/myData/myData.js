import { useState, useEffect } from "react";
import './myData.css';
import { Line } from 'react-chartjs-2';

import data from './data.json';

export default function MyData2() {
    const attribute_ko = ['측정 시간', '측정 위치', '소속', '습도', '기온', '탁도', 'pH', '미세먼지', '용존산소량', '이산화탄소', '조도', '토양 습도', '기압'];
    const attribute = ['measuredDate', 'location', 'unit', 'hum', 'temp', 'tur', 'ph', 'dust', 'dox', 'co2', 'lux', 'hum_EARTH', 'pre'];

    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [showIndividual, setShowIndividual] = useState(false);
    const [showComparative, setShowComparative] = useState(false);

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

    /*
    let graphData =  {
        labels: filteredData.map((item) => item.measuredDate),
        datasets: datasets
    };
    */

    /*개별 그래프*/
    const drawIndividualGraph = () => {
        if (start === null || end === null) alert("그래프 시작과 끝을 선택해주세요.")
        else {
            setShowIndividual(true);
            setShowComparative(false);
        }
    }

    /*비교 그래프*/
    const drawComparativeGraph = () => {
        if (start === null || end === null) alert("그래프 시작과 끝을 선택해주세요.")
        else if (var1 === var2) alert("서로 다른 변인을 선택해주세요.")
        else {
            setShowComparative(true);
            setShowIndividual(false);
        }
    }
    
    /*개별 그래프와 비교 그래프 공통 datasets*/
    let datasets = sensorName.map((key, index) => ({
        type: 'line',
        label: sensorName_ko[index],
        backgroundColor: borderColors[index],
        borderColor: borderColors[index],
        data: filteredData.map((item) => item[key]),
        borderWidth: 2,
        yAxisID: sensorName[index]
    }));

    /*개별 그래프*/
    const individualGraphs = sensorName.map((name, index) => (
        <div key={name} style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem', width: '50%' }}>
          <Line type="line" data={{
            labels: filteredData.map((item) => item.measuredDate),
            datasets: [datasets[index]]
          }} />
        </div>
    ));

    /*비교 그래프 변인 2개 설정*/
    const [var1, setVar1] = useState(0);
    const [var2, setVar2] = useState(0);

    /*비교 그래프 option*/
    const options = {
        scales: {
            x: {
                grid: {
                display: true,
                },
            },
            [sensorName[var1]]: {
                type: 'linear',
                position: 'left',
                grid: {
                    display: true,
                },
                title: {
                    display: true,
                    text: sensorName_ko[var1]
                },
            },
            [sensorName[var2]]: {
                type: 'linear',
                position: 'right',
                grid: {
                    display: false,
                },
                title: {
                    display: true,
                    text: sensorName_ko[var2], 
                },
            },
        },
    };

    console.log(var1)

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
            </div>

            <div style={{display: 'flex'}}>
                <label style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>그래프 종류 선택하기</label>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: '1rem'
                }}> 
                    <button className="drawGraph" onClick={drawIndividualGraph}>개별 그래프</button>
                    <div style={{display: 'flex', marginTop: '0.5rem'}}>
                        <button className="drawGraph" onClick={drawComparativeGraph}>비교 그래프</button>
                        <select className='select-var' onChange={(e) => setVar1(e.target.selectedIndex)}>
                            {sensorName_ko.map((name) => (
                                <option key={name}>{name}</option>
                            ))}
                        </select>
                        <select className='select-var' onChange={(e) => setVar2(e.target.selectedIndex)}>
                            {sensorName_ko.map((name) => (
                                <option key={name}>{name}</option>
                            ))}
                        </select>
                    </div>  
                </div>
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
                        <td key={name}
                            style={{ background: 
                                (start === item['measuredDate'] && '#FFDDE4') ||
                                (end === item['measuredDate'] && '#C7CDFF') ||
                                'transparent'
                            }}>
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
            
            {showIndividual && 
                <div style={{display: 'flex', flexWrap: 'wrap', width: '100%', justifyContent: 'center'}}>
                    {individualGraphs}
                </div>
            }

            {showComparative && 
                <div style={{display: 'flex', justifyContent: 'center', width: '100%', marginTop: '5rem'}}>
                    <div style={{width: '70%'}}>
                        <Line 
                            data={{
                                labels: filteredData.map((item) => item.measuredDate),
                                datasets: [datasets[var1], datasets[var2]]
                            }} 
                            options={options} />
                    </div>
                </div>
            }  
        </div>
    )
}