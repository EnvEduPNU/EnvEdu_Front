import SockJS from 'sockjs-client';
import {useState} from "react";
import SingleDataContainer from "./SingleDataContainer";
import {decodeToken} from "react-jwt";
import {customAxios} from "../Common/CustomAxios";



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

function SampleSocket(props) {
    console.log(props.clickedIndexes)
    /**
     * 센서 기기에서 전송하는 데이터 종류
     */
    const dataTypes = ["temp", "pH", "hum", "hum_earth", "tur", "dust", "dox", "co2", "lux", "pre"];


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

    return (
            <div>
                <div>
                    <div>
                        {/*
                        <span className="border p-2" style={{
                            cursor: "pointer",
                            backgroundColor: '#D9DCFF'//`${connected === false ? "rgb(192,192,192)" : "rgb(102,255,102)"}`
                        }} onClick={() => {
                            if (connected === false) {
                                
                                if (props.username === decodeToken(localStorage.getItem("access_token"))) {
                                    location = prompt("위치 정보를 입력하세요(optional)");
                                }
                                
                                register();
                            } else {
                                disconnect();
                            }
                        }}>{props.mac}</span>
                    */}

                        {
                            /*
                            props.username === decodeToken(localStorage.getItem("access_token")).username ? (
                                <span className="p-2" style={{fontSize: "0.7em"}}><input type="checkbox"
                                                                                         checked={checked}
                                                                                         onChange={() => {
                                                                                             save = !save;
                                                                                             setChecked(!checked)
                                                                                         }}/>&nbsp;데이터 저장하기</span>

                                                                                        ) : 
                                                                                         
                                                                                        (<div></div>)
                            */
                        }
                    </div>
                </div>
                <div style={{
                    fontSize: "0.6em",
                    color: "red"
                }}>{connected === true && isConnectionDropped === true ? "전송 중단됨" : ""}</div>
                {/*</div><div className={connected === true ? "border pt-2 ps-2 pe-2" : ""}>*/}
                <div>
                    {
                        //connected === true
                            //? 
                            
                            dataTypes.map((elem) =>
                                (//props.clickedIndexes.includes(index) &&
                                
                                <div key={elem} style={{}}>
                                    <SingleDataContainer type={elem} data={receivedData}
                                                         current={receivedData[receivedData.length - 1]} stomp={stompClient}
                                                         sendFunction={sendCalibrationMsg}/>
                                </div>)
                            )
                            //: (<></>)
                    }
                </div>
            </div>
        );
}

export default SampleSocket;