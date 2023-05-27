import { useState } from 'react';
import { customAxios } from "../../Common/CustomAxios";
import ExtendableInputs from "../../Common/ExtendableInputs";

function AddMACForm() {
    /**
     * 어드민이 소켓 연결을 허용할 기기를 추가하는 컴포넌트
     * 기기의 접근은 MAC주소를 기반으로 제어함
     */
    const [inputs, setInputs] = useState([]);

    function submit() {
        customAxios.post("/admin/device", { macs: inputs })
            .then(() => {
                alert("done");
            });
    }
    
    return (
        <div>
            <ExtendableInputs submit={submit} inputs={inputs} setInputs={setInputs} placeholder={"00:00:00:00:00:00"}/>
        </div>
    );
}

export default AddMACForm;