import { useState, useEffect } from 'react';
import { customAxios } from '../../Common/CustomAxios';
import './leftSlidePage.scss';
import { useGraphDataStore } from '../store/graphStore';

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

        //대기질 데이터
        "stationName": '조사지점명',
        "dataTime": "측정일",
        "so2Value": "아황산가스 농도(ppm)",
        "coValue": "일산화탄소 농도(ppm)",
        "o3Value": "오존 농도(ppm)",
        "no2Value": "이산화질소 농도(ppm)",
        "pm10Value": "미세먼지(PM10) 농도(㎍/㎥)",
        "pm25Value": "미세먼지(PM2.5)  농도(㎍/㎥)",
        
        //SEED 데이터
        "measuredDate": "측정 시간",
        "location": "측정 장소",
        "unit" : "소속",
        "period" : "저장 주기",
        "username": "사용자명",
        "hum": "습도",
        "temp": "기온",
        "tur": "탁도",
        "ph": "pH",
        "dust": "미세먼지",
        "dox": "용존산소량",
        "co2": "이산화탄소",
        "lux": "조도",
        "hum_EARTH": "토양 습도",
        "pre": "기압"
    };
    return kor[name] || name;
}

export default function LeftSlidePage() {
    /*데이터 요약 정보*/
    const [summary, setSummary] = useState([]);
    
    useEffect(() => {
        customAxios.get('/mydata/list')
            .then((res) => {
                const formattedData = res.data.map(data => ({
                    ...data,
                    saveDate: data.saveDate.split('T')[0],
                    dataLabel: data.dataLabel === "AIRQUALITY" ? "대기질 데이터" : (
                        data.dataLabel === "OCEANQUALITY" ? "수질 데이터" : data.dataLabel
                    )
                }));
                setSummary(formattedData);
            })
            .catch((err) => console.log(err));
    }, []);

    const { setData } = useGraphDataStore();

    const getTable = (type, id) => {
        let path = ''
        if (type === "수질 데이터") {
            path = `/ocean-quality/mine/chunk?dataUUID=${id}`;
        } else if (type === "대기질 데이터") {
            path = `/air-quality/mine/chunk?dataUUID=${id}`;
        } else if (type === "SEED") {
            path = `/seed/mine/chunk?dataUUID=${id}`;
        }

        customAxios.get(path)
        .then((res)=>{
            let headers = Object.keys(res.data[0]).filter(
                (key) => key !== "id" && key !== "dataUUID" && key !== "saveDate" && key !== "dateString"
            );

            const attributesToCheck = [
                "co2",
                "dox",
                "dust",
                "hum",
                "hum_EARTH",
                "lux",
                "ph",
                "pre",
                "temp",
                "tur"  
            ];
            
            for (const attribute of attributesToCheck) {
                const isAllZero = res.data.every(item => item[attribute] === 0);
                // 해당 속성이 모두 0일 때, headers에서 제거
                if (isAllZero) {
                    headers = headers.filter(
                        (header) => header !== attribute
                    );
                }
            }

            headers = headers.map((header) => engToKor(header));
            
            // 각각의 딕셔너리에서 값만 추출하여 리스트로 변환
            const keysToExclude = ["id", "dataUUID", "saveDate", "dateString"];

            const values = res.data.map(item => {
                const filteredItem = Object.keys(item)
                    .filter(key => !keysToExclude.includes(key))
                    .reduce((obj, key) => {
                    obj[key] = item[key];
                    return obj;
                    }, {});
                return Object.values(filteredItem);
            });

            // 최종 결과 생성 (헤더 + 값)
            const recombined = [headers, ...values];
            
            setData(recombined);
            localStorage.setItem("data", JSON.stringify(recombined));
        })
        .catch((err) => console.log(err));
    };
    
    const [filteredData, setFilteredData] = useState([]);
    const selectFolder = (type) => {
        let filtered;
        if (type === '전체') {
            filtered = summary;
        }
        else if (type == '대기질') {
            filtered = summary.filter((data) => data.dataLabel === '대기질 데이터');
        }
        else if (type == '수질') {
            filtered = summary.filter((data) => data.dataLabel === '수질 데이터');
        }
        else if (type == 'SEED') {
            filtered = summary.filter((data) => data.dataLabel === 'SEED');
            
        }
        setFilteredData(filtered);
    }   

    return (
        <div className="e-class-mydata">
            {/*folder + 데이터 요약 정보*/}
            <div className="myData-left">
                {/*데이터 요약 정보*/}
                <div className='myData-summary'>
                    <div style={{ overflowY: 'scroll', height: '40rem' }}>
                        <h4>My Data</h4>

                        <div style={{ marginTop: '1rem' }}>
                            <img src="/assets/img/folder-icon.png" style={{ width: '1.5rem', margin: '0 0.5rem' }} />
                            <label onClick={()=>selectFolder('전체')}>전체</label>
                            <img src="/assets/img/folder-icon.png" style={{ width: '1.5rem', margin: '0 0.5rem' }} />
                            <label onClick={()=>selectFolder('대기질')}>대기질</label>
                            <img src="/assets/img/folder-icon.png" style={{ width: '1.5rem', margin: '0 0.5rem' }} />
                            <label onClick={()=>selectFolder('수질')}>수질</label>
                            <img src="/assets/img/folder-icon.png" style={{ width: '1.5rem', margin: '0 0.5rem' }} />
                            <label onClick={()=>selectFolder('SEED')}>SEED</label>
                        </div>

                        {filteredData.length > 0 && (
                        <table className='summary-table'>
                            <thead>
                                <tr>
                                    <th key="saveDate">저장 일시</th>
                                    <th key="dataLabel">데이터 종류</th>
                                    <th key="memo">메모</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr key={index} onClick={() => getTable(item.dataLabel, item.dataUUID)}>
                                        <td>{item.saveDate}</td>
                                        <td>{item.dataLabel}</td>
                                        <td>{item.memo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        )}
                    </div>
                </div>
            </div>
            {/*
            <div className='myData-right'>
                {details.length !== 0 && 
                    <>
                        <table border="1" className='myData-detail'>
                            <thead>
                                <tr>
                                    {headers.map((header) => (
                                        <th key={header}>{engToKor(header)}</th>
                                    ))}
                                </tr>
                            </thead>
                            
                            <tbody>
                                {details.map((item) => (
                                    <tr key={item.id}>
                                        {headers.map((header) => (
                                            <td key={header}>{item[header]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                }
            </div>
            */} 
        </div>
    );
};

