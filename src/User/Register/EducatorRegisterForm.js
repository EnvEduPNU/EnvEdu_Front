import {useForm} from "react-hook-form";
import {RESPONSE_CONFLICT, RESPONSE_SERV_UNAVAILABLE} from "../../Common/Response";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {ROLE} from "../../Common/Role";
import {customAxios} from "../../Common/CustomAxios";

function EducatorRegisterForm()
{
    const {register,handleSubmit,formState: {errors}} = useForm();

    const navigate = useNavigate();

    const [passwordCheck, setPasswordCheck] = useState("");

    function onSubmit(data)
    {
        if(data.password === passwordCheck)
        {
            customAxios.post("/register/educator", {...data}).then((response) => {
                if(response.data.code === 200)
                {
                    alert("입력하신 메일 주소로 인증번호를 전송했습니다. 가입 완료를 위해 인증번호를 입력해주세요");
                    navigate("/register/authentication", {state: { username: data.username, email: data.email, userRole: ROLE[1] }});
                }
            }).catch((error) => {
                    if (error.response.request.status === RESPONSE_CONFLICT)
                    {
                        alert("형식에 맞게 입력해주세요");
                    }
                    else if(error.response.request.status === RESPONSE_SERV_UNAVAILABLE)
                    {
                        alert("메일 전송에 실패했습니다");
                    }
                    else
                    {
                        alert(error.response.request.status);
                    }
            })
        }
        else
        {
            alert("비밀번호를 확인해주세요");
        }
    }

    return(
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input placeholder="아이디: 5~20자" {...register("username", {required: {value: true, message: "아이디를 입력하세요"}})}/>
                    {errors.username && <span style={{color:'red', fontSize:"13px"}}>{errors.username.message}</span>}
                </div>
                <div>
                    <input placeholder="비밀번호: 8~20자" type="password" {...register("password", {required: {value: true, message: "비밀번호를 입력하세요"}})}/>
                    {errors.password && <span style={{color:'red', fontSize:"13px"}}>{errors.password.message}</span>}
                </div>
                <div>
                    <input placeholder="비밀번호 확인" type="password" onChange={(e)=>{setPasswordCheck(e.target.value)}}/>
                </div>
                <div>
                    <input placeholder="이메일" type="email" {...register("email", {required: {value: true, message: "이메일을 입력하세요"}})}/>
                    {errors.email && <span style={{color:'red', fontSize:"13px"}}>{errors.email.message}</span>}
                </div>
                {/*<div>
                    <input placeholder="기기 MAC 주소 XX-XX-XX-XX" maxLength={20} {...register("userDeviceMAC", {
                        required: {
                            value: true,
                            message: "MAC 주소를 입력하세요"
                        }
                    })}/>
                    {errors.userDeviceMAC &&
                        <span style={{color: 'red', fontSize: "13px"}}>{errors.userDeviceMAC.message}</span>}
                </div>*/}
                <input type="submit"/>
            </form>
        </>
    );
}

export default EducatorRegisterForm;