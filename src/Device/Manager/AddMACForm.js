import { useState } from 'react';
import { customAxios } from "../../Common/CustomAxios";
import ExtendableInputs from "../../Common/ExtendableInputs";

function AddMACForm() {
    const [inputs, setInputs] = useState([]);

    function submit() {
        customAxios.post("/admin/device", { macs: inputs })
            .then(() => {
                alert("done");
            });
    }
    // const {register,handleSubmit,formState: {errors}} = useForm();

    // function onSubmit(data) {
    //     if(window.confirm("MAC 주소를 확인하셨나요?")) {
    //         customAxios.post("/admin/device", {...data})
    //             .then(() => {
    //                 alert("등록 완료");
    //             })
    //     }
    // }

    // return (
    //     <>
    //         <form onSubmit={handleSubmit(onSubmit)}>
    //             <div>
    //                 <input placeholder="00:00:00:00:00:00" {...register("mac", {required: {value: true, message: "MAC 주소를 입력하세요"}})}/>
    //                 {errors.MAC && <span style={{color:'red', fontSize:"13px"}}>{errors.MAC.message}</span>}
    //             </div>
    //             <button type="submit">추가하기</button>
    //         </form>
    //     </>
    // );
    return (
        <div>
            <ExtendableInputs submit={submit} inputs={inputs} setInputs={setInputs} placeholder={"00:00:00:00:00:00"}/>
        </div>
    );
}

export default AddMACForm;