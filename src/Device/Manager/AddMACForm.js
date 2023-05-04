import {useForm} from "react-hook-form";
import {customAxios} from "../../Common/CustomAxios";

function AddMACForm() {
    const {register,handleSubmit,formState: {errors}} = useForm();

    function onSubmit(data) {
        if(window.confirm("MAC 주소를 확인하셨나요?")) {
            customAxios.post("/admin/device", {...data})
                .then(() => {
                    alert("등록 완료");
                })
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input placeholder="00:00:00:00:00:00" {...register("mac", {required: {value: true, message: "MAC 주소를 입력하세요"}})}/>
                    {errors.MAC && <span style={{color:'red', fontSize:"13px"}}>{errors.MAC.message}</span>}
                </div>
                <button type="submit">추가하기</button>
            </form>
        </>
    );
}

export default AddMACForm;