import { useState } from "react";
import { customAxios } from "../../Common/CustomAxios";

export default function AddDevice() {
    const [formData, setFormData] = useState({
        mac: "",
        username: "",
        deviceName: "",
        reset: "false",
    });

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value});
    };

    const { mac, username, deviceName, reset } = formData;
    const isValidMacAddress = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})\s*$/;

    const handleDevice = () => {
        if (mac === "") {
            alert("MAC 주소를 입력해주세요.");
        } else if (!isValidMacAddress.test(mac)) {
            alert("MAC 주소의 형식을 지켜주세요.");
        } else if (username === "") {
            alert("사용자 이름을 입력해주세요.");
        } else if (deviceName === "") {
            alert("기기명을 입력해주세요.");
        } else {
            customAxios.put('/admin/device', formData)
                .then(() => alert("기기 정보가 성공적으로 업데이트 되었습니다."))
                .catch((err) => console.log(err));
        }
    };

    return (
        <div>
            <div style={{marginBottom: '1rem'}}>
                <label style={{fontWeight: '600', width: '5rem'}}>MAC 주소</label>
                <input name="mac" value={mac} onChange={handleInput} style={{borderRadius: '0.625rem', width: '20rem', margin: '0 0.5rem'}} />
                <span style={{color: '#5891FF'}}>MAC 주소는 aa:bb:cc:dd:ee:ff 형식으로 입력해주세요.</span>
            </div>
            
            <div style={{marginBottom: '1rem'}}>
                <label style={{fontWeight: '600', width: '5rem'}}>사용자 이름</label>
                <input name="username" value={username} onChange={handleInput} style={{borderRadius: '0.625rem', width: '20rem', margin: '0 0.5rem'}} />
            </div>

            <div style={{marginBottom: '1rem'}}>
                <label style={{fontWeight: '600', width: '5rem'}}>기기명</label>
                <input name="deviceName" value={deviceName} onChange={handleInput} style={{borderRadius: '0.625rem', width: '20rem', margin: '0 0.5rem'}} />
            </div>

            <div style={{display: 'flex', justifyContent: 'center', width: '30rem'}}>
                <button 
                    onClick={handleDevice}
                    style={{
                        borderRadius: '1.25rem',
                        border: 'none',
                        background: "#5891FF",
                        color: '#fff'
                    }}>
                    기기 정보 업데이트
                </button>
            </div> 
        </div>
    );
};