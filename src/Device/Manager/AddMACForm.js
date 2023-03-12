import {useForm} from "react-hook-form";
import {customAxios} from "../../Common/CustomAxios";
import {RESPONSE_BAD_REQ} from "../../Common/Response";
import {decodeToken} from "react-jwt";

function AddMACForm()
{
    const {register,handleSubmit,formState: {errors}} = useForm();

    function onSubmit(data)
    {
        data.username = localStorage.getItem("jwt") === null ? null : decodeToken(localStorage.getItem("jwt")).username;
        if(data.username === null)
        {
            alert("로그인을 먼저 해주세요");
            return;
        }
        if(window.confirm("MAC 주소를 확인하셨나요?")) {
            customAxios.post("/manager/device", {...data})
                .then((response) => {
                    alert("등록 완료");
                })
                .catch((error) => {
                    if (error.response.request.status === RESPONSE_BAD_REQ) {
                        alert("MAC 주소의 형식이 틀렸습니다");
                    }
                })
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input placeholder="00:00:00:00:00:00" {...register("MAC", {required: {value: true, message: "MAC 주소를 입력하세요"}})}/>
                    {errors.MAC && <span style={{color:'red', fontSize:"13px"}}>{errors.MAC.message}</span>}
                </div>
                <div>
                    <input placeholder="기기를 등록할 사용자의 아이디" {...register("username", {required: {value: true, message: "사용자 아이디를 입력하세요"}})}/>
                    {errors.username && <span style={{color:'red', fontSize:"13px"}}>{errors.username.message}</span>}
                </div>
                <button type="submit">추가하기</button>
            </form>
        </>
    );
}

export default AddMACForm;