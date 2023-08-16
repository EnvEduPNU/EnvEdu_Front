import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import {decodeToken} from "react-jwt";
import { customAxios } from '../../Common/CustomAxios';
import MeasureSub from './measure_sub';
import './measure.scss';

const stomp = require('stompjs');
/**
 * 웹 소켓 연결을 위한 stompClient
 */
let stompClient = null;

/**
 * 받은 데이터를 객체로 관리하기 위한 용도
 */
let receiveObject = null;

/**
 * 받은 데이터를 저장할지에 대한 여부
 */
let save = false;

/**
 * 마지막으로 데이터를 받은 날짜
 */
let lastReceivedDate = null;

export default function Measure() {
    const [connectableSocket, setConnectableSocket] = useState([]);
    useEffect(()=>{
        /**
         * 자신과 연관된 기기의 정보를 가져옴
         * 학생의 경우, 자신에게 등록된 기기
         * 교사의 경우, 자신에게 등록된 기기 + 자신이 지도하는 모든 학생에게 등록된 기기
         */
        customAxios.get(`/user/device`)
            .then((response)=>{
                setConnectableSocket(response.data.relatedUserDeviceList);
            })
    },[]);

    /**
     * 센서 기기에서 전송하는 데이터 종류
     */
    const dataTypes = ["temp", "ph", "hum", "hum_EARTH", "tur", "dust", "dox", "co2", "lux", "pre"];
    const dataTypes_ko = ["기온", "pH", "습도", "토양 습도", "탁도", "미세먼지", "용존산소량", "이산화탄소 농도", "조도", "기압"]

    const [checked, setChecked] = useState(false);

    /**
     * 현재 웹 소켓 연결 여부
     */
    const [connected, setConnected] = useState(false);

    /**
     * 전송받은 데이터
     */
    const [receivedData, setReceivedData] = useState([]);

    /**
     * 저장할 데이터
     */
    const [saveData, setSaveData] = useState([]);

    /**
     * 위치 정보
     * 웹 소켓을 연결할 때만 설정 가능
     */
    let location = "";

    /**
     * 연결 끊김 여부
     */
    const [isConnectionDropped, setIsConnectionDropped] = useState(false);

    /**
     * 연결 끊김 체크
     * 5초 주기로 현재 Date와 마지막으로 데이터를 전송받은 시점의 Date를 비교
     * 6초 이상인 경우, 연결이 끊긴 것으로 간주
     */
    setInterval(() => {
        if (lastReceivedDate !== "") {
            const currentDate = new Date();
            const lastReceivedDateInMillis = Date.parse(lastReceivedDate);
            if (lastReceivedDate === null || Date.parse(currentDate.toUTCString()) - lastReceivedDateInMillis >= 6000) {
                setIsConnectionDropped(true);
            }
        }
    }, 5000);

    /**
     * 서버에 웹 소켓 커넥션 생성
     */
    function register() {
        const sock = new SockJS(`${process.env.REACT_APP_API_URL}/client/socket`);
        stompClient = stomp.over(sock);
        stompClient.connect({authorization: localStorage.getItem("refresh")}, onConnected, onError)
    }

    function disconnect() {
        stompClient.disconnect();
        setConnected(false);
    }

    /**
     * 커넥션 생성 성공 시, 센서 기기에서 전송하는 데이터를 받기 위해 MAC 주소를 이용한 경로로 subscribe
     */
    function onConnected() {
        setConnected(true);
        //수정함
        stompClient.subscribe("/topic/user/" + connectableSocket[0].elements[0].mac, onMessageReceived, onError);
    }

    function onError() {
        alert("연결 실패");
    }

    /** 
     * 데이터 수신 시, 실행되는 핸들러
     */
    function onMessageReceived(payload) {
        /**
         * 가장 최근 데이터가 수신된 시점 갱신
         * 데이터를 받았으므로 연결 끊김 여부를 false로 설정
         */
        lastReceivedDate = new Date();
        setIsConnectionDropped(false);

        /**
         * 받은 데이터 파싱 
         */
        receiveObject = JSON.parse(payload.body);
        if (location !== "") {
            receiveObject.location = location;
        }

        //lastReceivedDate = receiveObject.dateString;

        /**
         * 받은 데이터를 receivedData에 추가
         * 최대 10개
         */
        receivedData.push(receiveObject);
        if (receivedData.length > 10) {
            receivedData.splice(0, 1);
        }

        if (save === true) {
            /**
             * 저장이 활성화된 경우
             * 받은 데이터를 saveData에 추가
             * 5개가 쌓이면 한 번에 서버로 전송해 저장
             */
            saveData.push(JSON.stringify(receiveObject));
            setSaveData([...saveData]);
            if (saveData.length === 5) {
                customAxios.post("/user/save", {data: saveData}).then().catch(() => {
                    disconnect();
                });
                saveData.splice(0, saveData.length);
                setSaveData([...saveData]);
            }
        }
        setReceivedData([...receivedData]);
    }

    const [selectedDataTypes, setSelectedDataTypes] = useState([]);

    const handleCheckboxChange = (dataType) => {
        const index = dataTypes_ko.indexOf(dataType);
        if (selectedDataTypes.includes(dataTypes[index])) {
            setSelectedDataTypes(selectedDataTypes.filter(item => item !== dataTypes[index]));
        } else {
            if (index !== -1) setSelectedDataTypes([...selectedDataTypes, dataTypes[index]]);
        }
    };

    /*측정 시작*/
    const handleStart = () => {
        if (selectedDataTypes.length === 0) {
            alert("센서를 1개 이상 선택해주세요.")
        }
        else {
            if (connected === false) { 
                register(); 
                setPaused(false); 
            }
        }
    }

    /*일시 정지*/
    const [paused, setPaused] = useState(false);

    const handlePause = () => {
        console.log(stompClient)
        if (stompClient && !paused) { //일시 정지
            disconnect();
            setPaused(true);
            
        } /*else if (paused) { //다시 시작
            register();
            setConnected(true);
            setPaused(false); 
        }
        */
    };

    /*항목 입력*/
    const [item, setItem] = useState('');
    const handleItem = (e) => {
        setItem(e.target.value);
    }

    /*연결된 기기 + mac 주소*/
    const [hovered, setHovered] = useState(false);

    console.log(selectedDataTypes)
    console.log(receivedData)

    return(
        <div className='measurement-container'>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <label>제목</label>
                <input className='title' placeholder='제목을 입력해주세요' />
            </div>

            <div style={{display: 'flex', alignItems: 'center', marginTop: '1rem'}}>
                <label>측정 항목/장소</label>
                <input className='item' onChange={handleItem} placeholder='ex) 식초, 교실' />
            </div>

            <div style={{display: 'flex', alignItems: 'center', marginTop: '1rem'}}>
                <label>센서 선택</label>
                {/*<select className='select-sensor' onChange={handleSensor}>*/}
                {dataTypes_ko.map((dataType) => (
                    <label 
                        style={{textAlign: 'center', fontWeight: '500'}}
                        key={dataType}
                    >
                        <input 
                            type='checkbox' 
                            checked={selectedDataTypes.includes(dataTypes[dataTypes_ko.indexOf(dataType)])}
                            onChange={() => handleCheckboxChange(dataType)} 
                        />
                        {dataType}
                    </label>  
                ))}
            </div>

            <div>
                <label>연결된 기기</label>
                {!connected && !paused && <span className='navy-span' style={{marginRight: '1rem'}}>없음</span>}

                {connected && connectableSocket !== undefined && connectableSocket.length > 0 && (
                    <span
                        className='navy-span'
                        style={{ marginRight: '1rem', cursor: 'pointer' }}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        {hovered ? connectableSocket[0].elements[0].mac : connectableSocket[0].elements[0].deviceName}
                    </span>
                )}

                <label>기기 상태</label>
                <span className='navy-span' style={{marginRight: '2rem'}}>
                    {connected
                    ? (isConnectionDropped
                        ? "전송 중단"
                        : "연결됨")
                    : (paused
                    ? "일시 정지"
                    : "연결 해제")}
                </span>

                <button onClick={handleStart}>
                    <img src='/assets/img/start.png' /> 측정 시작
                </button>
                {/*<button onClick={handlePause}>{paused ? '다시 시작' : '일시 정지'}</button>*/}
                <button onClick={handlePause}>
                    <img src='/assets/img/pause.png' /> 일시 정지
                </button>
                
                <MeasureSub selectedDataTypes={selectedDataTypes} data={receivedData} current={receivedData[receivedData.length - 1]} item={item} /> {/*SingleDataContainer*/}
    
            </div>
        </div>
    )
}