import SockJS from 'sockjs-client';
import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {customAxios} from "../Common/CustomAxios";


const stomp = require('stompjs');
let stompClient = null;
let json = null;
let cnt = 0;
function TestSocket()
{
    const [connected, setConnected] = useState(false);
    useEffect(()=>{
       /* json = {};
        json.mac = "bb:bb:bb:bb:bb:bb";
        json.hum = 40 + cnt;
        json.temp = 24 + cnt;
        json.tur = 72.4 + cnt;
        json.ph = 71.4 + cnt;
        json.co2 = 74.4 + cnt;
        json.dust = 74.4;
        json.hum_EARTH = 72.4;
        json.lux = 7.34;
        json.do = 7.54;
        json.pre = 7.41;
        cnt++;*/
    },[])

    function register()
    {
        const sock = new SockJS("http://localhost:8080/client/socket");
        stompClient = stomp.over(sock);
        stompClient.connect({authorization: localStorage.getItem("refresh")}, onConnected, onError)
    }

    function disconnect()
    {
        stompClient.disconnect();
        setConnected(false);
    }

    function onConnected()
    {
        setConnected(true);
        stompClient.subscribe("/topic/test", onMessageReceived, onError);
    }

    function onError()
    {
        alert("연결 실패");
    }

    function onMessageReceived(payload)
    {
        console.log(payload);
    }

    function getRand(min, max)
    {
        return Math.random() * (max-min) + min;
    }

    function send()
    {
        json = {};
        json.mac = "bb:bb:bb:bb:bb:bb";
        json.hum = getRand(20, 40);
        json.temp = getRand(20, 40);
        json.tur = getRand(20, 40);
        json.ph = getRand(20, 40);
        json.co2 = getRand(20, 40);
        json.dust = getRand(20, 40);
        json.hum_EARTH = getRand(20, 40);
        json.lux = getRand(20, 40);
        json.dox = getRand(20, 40);
        json.pre = getRand(20, 40);
        json.date = "2022-12-27T20:46:03.734431";
        cnt++;
        stompClient.send("/topic/C0:49:EF:EF:EF:78", {}, "{EXITDO}");
    }


    return(
        <>
            {
                connected === false ? (<Button onClick={register}>connect</Button>) : (<Button onClick={disconnect}>disconnect</Button>)
            }
            &nbsp;&nbsp;
            <Button onClick={send}>send</Button>
        </>
    );
}

export default TestSocket;