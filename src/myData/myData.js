import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { customAxios } from '../Common/CustomAxios';
import './myData.scss';

/*folder*/
const Folder = ({ folder }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleFolder = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div onClick={toggleFolder}>
        {isExpanded ? 'ㄴ' : '+'} 
        <img src="/assets/img/folder-icon.png" style={{ width: '1.5rem', margin: '0.5rem' }} />
        {folder.folderName}
      </div>
      {isExpanded && folder.child.length > 0 && (
        <div style={{ marginLeft: '1.25rem' }}>
          {folder.child.map((subfolder) => (
            <Folder key={subfolder.id} folder={subfolder} />
          ))}
        </div>
      )}
    </div>
  );
};

const FolderStructure = ({ data }) => {
  return (
    <div>
      {data.map((folder) => (
        <Folder key={folder.id} folder={folder} />
      ))}
    </div>
  );
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

const MyData = () => {
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

    const [details, setDetails] = useState([]);
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
            setDetails(res.data);
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
            setHeaders(headers);
        })
        .catch((err) => console.log(err));
    };

    const [headers, setHeaders] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isFull, setIsFull] = useState(false);
    function handleFullCheck(){
        setIsFull(!isFull)
        if (isFull)
            setSelectedItems([])
        else
            setSelectedItems(details)
    }

    function handleViewCheckBoxChange(item) {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    }

    const handleDownload = () => { 
        //const arr = [{ age: 10, gender: 'Male', name: "abc" }, {age: 10, gender: 'Male', name: "123"}, {age: 10, gender: 'Male'}];
        if (selectedItems.length === 0) {
            alert("엑셀 파일로 내보낼 데이터를 한 개 이상 선택해 주세요.")
        }
        else {
            const modifiedSelectedItems = selectedItems.map((item) => {
                const newItem = { };
              
                for (const key in item) {
                    newItem[engToKor(key)] = item[key];
                }
                
                delete newItem.dataUUID;
                delete newItem.id;
                delete newItem.dateString;
    
                return newItem;
            });
    
            const filename = window.prompt("파일명을 입력해 주세요.");
            if (filename !== null) {
                const ws = XLSX.utils.json_to_sheet(modifiedSelectedItems);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                XLSX.writeFile(wb, `${filename}.xlsx`);
            } else {
                alert("엑셀 파일명을 입력해 주세요.");
            }   
        }
    }

    // 주어진 JSON 데이터
    const data = [
        {
        "id": 1,
        "folderName": "dataFolder1",
        "parent": null,
        "createDate": null,
        "updateDate": null,
        "child": [
            {
            "id": 2,
            "folderName": "dataFolder2",
            "parent": null,
            "createDate": null,
            "updateDate": null,
            "child": [
                {
                "id": 3,
                "folderName": "dataFolder3",
                "parent": null,
                "createDate": null,
                "updateDate": null,
                "child": [
                    {
                    "id": 4,
                    "folderName": "dataFolder4",
                    "parent": null,
                    "createDate": null,
                    "updateDate": null,
                    "child": []
                    }
                ]
                }
            ]
            }
        ]
        }
    ];

  return (
    <div className="myData-container">
        {/*folder + 데이터 요약 정보*/}
        <div className="myData-left">
            {/*folder*/}
            <div className='myData-folder'>
                <FolderStructure data={data} />
            </div>
            
            {/*데이터 요약 정보*/}
            <div className='myData-summary'>
                <div style={{ overflowY: 'scroll', height: '20rem' }}>
                    <span>데이터 요약 정보</span>
                    {summary.length > 0 && (
                    <table className='summary-table'>
                        <thead>
                            <tr>
                                <th key="saveDate">저장 일시</th>
                                <th key="dataLabel">데이터 종류</th>
                                <th key="memo">메모</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.map((item, index) => (
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

        <div className='myData-right'>
            {details.length !== 0 && 
                <>
                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <button 
                            className='excel-download'
                            onClick={() => handleDownload()}>
                            엑셀 파일로 저장
                        </button>
                    </div>
                    <table border="1" className='myData-detail'>
                        <thead>
                            <tr>
                                {headers.map((header) => (
                                    <th key={header}>{engToKor(header)}</th>
                                ))}
                                <th>
                                    <input
                                        type="checkbox"
                                        onChange={() => handleFullCheck()}
                                        checked={isFull}
                                    ></input>
                                </th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {details.map((item) => (
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
                </>
            }
        </div>
    </div>
  );
};

export default MyData;
