import { useState } from "react";
import { Button } from "react-bootstrap";
import { customAxios } from "../../Common/CustomAxios";


function DeviceListElem(props) {
    const [deviceName, setDeviceName] = useState(props.elem.name);
    const [username, setUsername] = useState(props.elem.username);

    function updateDeviceInfo() {
        customAxios.put("/admin/device", {mac: props.elem.mac, deviceName: deviceName, username: username, reset: 0})
        .then(()=>{
            alert("수정 완료");
            window.location.reload();
        });
    }

    function deleteDevice() {
        customAxios.delete(`/admin/device/${props.elem.mac}`)
        .then(()=>{
            alert("삭제 완료");
            window.location.reload();
        });
    }

    function reset() {
        customAxios.put("/admin/device", {mac: props.elem.mac, reset: 1})
        .then(()=>{
            alert("초기화 완료");
            window.location.reload();
        });
    }

    return (
        <tr style={{verticalAlign : "middle"}}>
            <td>{props.elem.mac}</td>
            <td><input value={deviceName} onChange={(e)=>setDeviceName(e.target.value)}/></td>
            <td><input value={username} onChange={(e)=>setUsername(e.target.value)}/></td>
            <td><Button onClick={updateDeviceInfo}>수정</Button></td>
            <td><Button onClick={deleteDevice}>삭제</Button></td>
            <td><Button onClick={reset}>초기화</Button></td>
        </tr>
    );
}

export default DeviceListElem;