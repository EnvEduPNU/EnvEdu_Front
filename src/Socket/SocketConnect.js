import SockJS from 'sockjs-client';
import {useState} from "react";
import SingleDataContainer from "./SingleDataContainer";
import {decodeToken} from "react-jwt";
import {customAxios} from "../Common/CustomAxios";
import DetailedInfoPage from "./DetailedInfoPage";



const stomp = require('stompjs');
let stompClient = null;
let receiveObject = null
let save = false;
let lastReceivedDate = null;

function SocketConnect(props) {
    const dataTypes = ["temp", "pH", "hum", "hum_earth", "tur", "dust", "dox", "co2", "lux", "pre"];
    const [checked, setChecked] = useState(false);
    const [connected, setConnected] = useState(false);
    const [receivedData, setReceivedData] = useState([]);
    const [saveData, setSaveData] = useState([]);
    let location = "";
    const [isConnectionDropped, setIsConnectionDropped] = useState(false);
    const [index, setIndex] = useState(0);

    setInterval(() => {
        if (lastReceivedDate !== "") {
            const currentDate = new Date();
            const lastReceivedDateInMillis = Date.parse(lastReceivedDate);
            if (lastReceivedDate === null || Date.parse(currentDate.toUTCString()) - lastReceivedDateInMillis >= 6000) {
                setIsConnectionDropped(true);
            }
        }
    }, 5000);

    function register() {
        const sock = new SockJS("http://13.124.156.11:8080/client/socket");
        stompClient = stomp.over(sock);
        stompClient.connect({authorization: localStorage.getItem("refresh")}, onConnected, onError)
    }

    function disconnect() {
        stompClient.disconnect();
        setConnected(false);
    }

    function onConnected() {
        setConnected(true);
        stompClient.subscribe("/topic/user/" + props.mac, onMessageReceived, onError);
    }

    function onError() {
        alert("연결 실패");
    }

    function sendCalibrationMsg(message) {
        stompClient.send("/topic/" + props.mac, {}, message);
    }

    function onMessageReceived(payload) {
        lastReceivedDate = new Date();
        setIsConnectionDropped(false);

        receiveObject = JSON.parse(payload.body);
        if (location !== "") {
            receiveObject.location = location;
        }
        lastReceivedDate = receiveObject.dateString;
        receivedData.push(receiveObject);
        if (receivedData.length > 10) {
            receivedData.splice(0, 1);
        }
        if (save === true) {
            saveData.push(JSON.stringify(receiveObject));
            setSaveData([...saveData]);
            if (saveData.length === 5) {
                console.log("save");
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
                <br/>
                <div className="d-flex justify-content-between">
                    <div>
                        <span className="border p-2" style={{
                            cursor: "pointer",
                            backgroundColor: `${connected === false ? "rgb(192,192,192)" : "rgb(102,255,102)"}`
                        }} onClick={() => {
                            if (connected === false) {
                                if (props.username === decodeToken(localStorage.getItem("refresh")).username) {
                                    location = prompt("위치 정보를 입력하세요(optional)");
                                }
                                register();
                            } else {
                                disconnect();
                            }
                        }}>{props.mac}</span>
                        {
                            props.username === decodeToken(localStorage.getItem("refresh")).username ? (
                                <span className="p-2" style={{fontSize: "0.7em"}}><input type="checkbox"
                                                                                         checked={checked}
                                                                                         onChange={() => {
                                                                                             save = !save;
                                                                                             setChecked(!checked)
                                                                                         }}/>&nbsp;데이터 저장하기</span>) : (
                                <div></div>)
                        }
                    </div>
                    <div>id: {props.username}</div>
                </div>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <div style={{
                    fontSize: "0.6em",
                    color: "red"
                }}>{connected === true && isConnectionDropped === true ? "전송 중단됨" : ""}</div>
                <div className={connected === true ? "border pt-2 ps-2 pe-2" : ""}>
                    {
                        connected === true && index === 0
                            ? dataTypes.map((elem) =>
                                (<div key={elem}>
                                    <SingleDataContainer type={elem} data={receivedData}
                                                         current={receivedData[receivedData.length - 1]} stomp={stompClient}
                                                         sendFunction={sendCalibrationMsg}/>
                                </div>)
                            )
                            : connected === true && index === 1 ? (<DetailedInfoPage types={dataTypes}
                                                                                     data={receivedData}
                                                                                     stomp={stompClient}
                                                                                     sendFunction={sendCalibrationMsg}/>) : (<></>)
                    }
                </div>
                <button onClick={()=>{setIndex(index-1)}} disabled={index == 0 ? true : false}>prev</button>
                <button onClick={()=>{setIndex(index+1)}} disabled={index == 2 ? true : false}>next</button>
            </div>
        );
}

export default SocketConnect;