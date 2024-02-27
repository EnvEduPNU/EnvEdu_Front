import SockJS from 'sockjs-client';
import {useEffect, useState} from "react";
import SingleDataContainer from "./SingleDataContainer";
import {decodeToken} from "react-jwt";
import {customAxios} from "../Common/CustomAxios";
import { BsRecordCircle } from "react-icons/bs";
import { FaRegStopCircle } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import React, { forwardRef, useImperativeHandle } from 'react';
import { MdError } from "react-icons/md";
import { MdSignalWifiStatusbarConnectedNoInternet } from "react-icons/md";
import { ImConnection } from "react-icons/im";

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

/*데이터 저장 중지 여부*/
let isFinished = false;

/**
 * 마지막으로 데이터를 받은 날짜
 */
let lastReceivedDate = null;

const SampleSocket = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        register,
    }));

    // 선택된 데이터 타입들을 저장하는 상태
    const [selectedTypes, setSelectedTypes] = useState([]);

    // 선택된 데이터 타입을 토글하는 함수
    const toggleSelectedType = (type) => {
        setSelectedTypes(prev => {
            // 이미 선택된 타입이면 제거, 아니면 추가
            return prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type];
        });
    };
    
    /**
     * 센서 기기에서 전송하는 데이터 종류
     */
    const dataTypes = ['temp', 'pH', 'hum', 'hum_earth', 'tur', 'dust', 'dox', 'co2', 'lux', 'pre'];
    //const dataTypes_ko = ["기온", "pH", "습도", "토양 습도", "탁도", "미세먼지", "용존산소량", "이산화탄소", "조도", "기압"];

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
        stompClient.subscribe("/topic/user/" + props.mac, onMessageReceived, onError);
    }

    function onError() {
        alert("연결 실패");
    }

    /** 
     * 몇몇 센서의 보정 메세지 전송 함수
     */
    function sendCalibrationMsg(message) {
        stompClient.send("/topic/" + props.mac, {}, message);
    }

    const [period, setPeriod] = useState("");
    const [location, setLocation] = useState("");
    const [memo, setMemo] = useState("");

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

        //lastReceivedDate = receiveObject.dateString;

        /**
         * 받은 데이터를 receivedData에 추가
         * 최대 10개
         */
        receivedData.push(receiveObject);
        if (receivedData.length > 10) {
            receivedData.splice(0, 1);
        }

        setReceivedData([...receivedData]);
    }

    //modal
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [save, setSave] = useState(false);

    useEffect(() => {
        if (save) {
            console.log("save==true 직후", selectedTypes)
            // receiveObject를 복제
            const updatedReceiveObject = { ...receiveObject };

            //선택하지 않은 센서의 값은 null로 만들기
            dataTypes.forEach((dataType) => {
                if (!selectedTypes.includes(dataType)) {
                    if (dataType === 'pH') {
                        updatedReceiveObject['ph'] = null;
                    }
                    else if (dataType === 'hum_earth') {
                        updatedReceiveObject['hum_EARTH'] = null;
                    }
                    else {
                        updatedReceiveObject[dataType] = null;
                    }
                }
            });
            
            updatedReceiveObject.username = props.username;

            const now = new Date();
            const year = now.getFullYear().toString().padStart(4, '0');
            const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줍니다.
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');

            const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            updatedReceiveObject.dateString = formattedDateTime;
            
            if (period !== "") {
                updatedReceiveObject.period = period;
            }
            if (location !== "") {
                updatedReceiveObject.location = location;
            }
            
            /**
             * 저장이 활성화된 경우
             * 받은 데이터를 saveData에 추가
             * 5개가 쌓이면 한 번에 서버로 전송해 저장
             */
            saveData.push(JSON.stringify(updatedReceiveObject));
            setSaveData([...saveData]);
            if (isFinished) {
                console.log("isFinished 이후", selectedTypes)
                customAxios.post("/seed/save/continuous", {data: saveData, memo: memo})
                    .then(() => {
                        console.log(saveData) //location, period 확인
                    })
                    .catch((err) => console.log(err))

                setSave(false);
                isFinished = false;

                saveData.splice(0, saveData.length);
                setSaveData([...saveData]);
            }
        }
    }, [save, selectedTypes, isFinished])

    return (
            <div>
                <div style={{padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                        {connected && !isConnectionDropped && 
                            <span style={{padding: '0.5rem', fontSize: '1rem', fontWeight: '600', borderRadius: '0.625rem', color: 'blue'}}>
                                <ImConnection size="20"/> 연결됨                 
                            </span>
                        }

                        {!connected && 
                            <span style={{padding: '0.5rem', fontSize: '1rem', fontWeight: '600', borderRadius: '0.625rem', color: 'red'}}>
                                <MdError size="20"/> 연결 해제                   
                            </span>
                        }

                        {connected && isConnectionDropped && 
                            <span style={{padding: '0.5rem', fontSize: '1rem', fontWeight: '600', borderRadius: '0.625rem', color: 'red'}}>
                                <MdSignalWifiStatusbarConnectedNoInternet size="20"/> 전송 중단                    
                            </span>
                        }
                    </div>

                    {
                        (!save || (save && selectedTypes.length === 0)) && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '0 1.5rem',
                                width: '10rem',
                                height: '2rem',
                                borderRadius: '0.625rem',
                                background: '#666666',
                                color: '#fff',
                                fontSize: '16px',
                                cursor: 'pointer',
                            }}
                            onClick={handleShow}
                            >   
                                <BsRecordCircle color='red' style={{ marginRight: '0.5rem' }}/>
                                데이터 기록
                            </div>
                        )
                    }

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>데이터 기록하기</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {/*저장 간격*/}
                            <div style={{display: 'flex'}}>
                                <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '1.25rem',
                                        width: '11rem',
                                        height:' 2rem',
                                        borderRadius: '1.25rem',
                                        background: '#CBE0FF',
                                        marginRight: '1.5rem'
                                    }}>
                                    시간 간격
                                </div>

                                <input style={{
                                    width: '40%',
                                    height: '2rem',
                                    borderRadius: '0.625rem',
                                    background: '#fff',
                                    border: '1px solid #d2d2d2',
                                    outline: 'none',
                                    fontSize: '1.25rem',
                                    padding: '0 1rem',
                                    marginRight: '1rem',
                                }} 
                                    onChange={(e) => setPeriod(e.target.value)} 
                                    placeholder='단위는 초' />
                            </div>

                            {/*측정 위치*/}
                            <div style={{display: 'flex', marginTop: '1rem'}}>
                                <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '1.25rem',
                                        width: '11rem',
                                        height:' 2rem',
                                        borderRadius: '1.25rem',
                                        background: '#CBE0FF',
                                        marginRight: '1.5rem'
                                    }}>
                                    측정 위치
                                </div>

                                <input style={{
                                    width: '40%',
                                    height: '2rem',
                                    borderRadius: '0.625rem',
                                    background: '#fff',
                                    border: '1px solid #d2d2d2',
                                    outline: 'none',
                                    fontSize: '1.25rem',
                                    padding: '0 1rem',
                                    marginRight: '1rem'
                                }} 
                                    onChange={(e) => setLocation(e.target.value)} />
                            </div>

                            {/*메모*/}
                            <div style={{display: 'flex', marginTop: '1rem'}}>
                                <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '1.25rem',
                                        width: '11rem',
                                        height:' 2rem',
                                        borderRadius: '1.25rem',
                                        background: '#CBE0FF',
                                        marginRight: '1.5rem'
                                    }}>
                                    메모
                                </div>

                                <input style={{
                                    width: '40%',
                                    height: '2rem',
                                    borderRadius: '0.625rem',
                                    background: '#fff',
                                    border: '1px solid #d2d2d2',
                                    outline: 'none',
                                    fontSize: '1.25rem',
                                    padding: '0 1rem',
                                    marginRight: '1rem'
                                }} 
                                    onChange={(e) => setMemo(e.target.value)} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                                <Button 
                                    style={{ width: '10rem', borderRadius: '1.25rem', background: '#d9dcff', border: 'none', color: '#000', fontSize: '1.25rem' }}
                                    onClick={() => { 
                                        if (selectedTypes.length === 0) {
                                            alert("저장할 센서를 한 개 이상 선택해주세요.")
                                        }
                                        else {
                                            setSave(true);
                                        }
                                        setShow(false);
                                    }}
                                >
                                        확인
                                </Button>
                            </div>
                        </Modal.Body>
                    </Modal>

                    {save && selectedTypes.length !== 0 &&
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '0 1.5rem',
                            width: '10rem',
                            height: '2rem',
                            borderRadius: '0.625rem',
                            background: '#666666',
                            color: '#fff',
                            fontSize: '16px',
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            console.log(selectedTypes);
                            isFinished = true;
                        }}>
                            <FaRegStopCircle style={{ marginRight: '0.5rem' }}/>
                            기록 중지
                        </div>
                    }
                </div>

                <div style={{ padding: '0 2rem 0.5rem 2rem' }} >
                    {dataTypes.map((elem) => (
                            <div key={elem}>
                                <SingleDataContainer 
                                    type={elem} 
                                    data={receivedData}
                                    current={receivedData[receivedData.length - 1]} 
                                    stomp={stompClient}
                                    sendFunction={sendCalibrationMsg}
                                    toggleSelection={toggleSelectedType}
                                    selectedTypes={selectedTypes}
                                />
                            </div>
                        ))}
                    
                    <div style={{
                        marginTop: '2.5rem',
                    }}>
                        
                    </div>
                        
                </div>
            </div>
        );
})

export default SampleSocket;