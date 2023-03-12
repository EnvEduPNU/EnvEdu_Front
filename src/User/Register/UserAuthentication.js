import {useState} from "react";
import {customAxios} from "../../Common/CustomAxios";
import {useLocation, useNavigate} from "react-router-dom";
import {RESPONSE_CONFLICT, RESPONSE_OK, RESPONSE_SERV_UNAVAILABLE} from "../../Common/Response";
import {ROLE} from "../../Common/Role";

function UserAuthentication()
{
    const location = useLocation();
    const email = location.state.email;
    const username = location.state.username;
    const userRole = location.state.userRole;
    const [authNum, setAuthNum] = useState("");

    const navigate = useNavigate();

    function onNumberChange(e)
    {
        setAuthNum(e.target.value);
    }

    function authenticate()
    {
        customAxios.patch("http://localhost:8080/register/auth",{username: username, email: email, authNum: authNum})
            .then((response)=>{
                if(response.data.code === RESPONSE_OK)
                {
                    let accessory = userRole === ROLE[1] ? " 권한신청을 해주세요" : "";
                    alert("인증완료되었습니다" + accessory);
                    navigate("/",{replace: true});
                }
            })
            .catch((error)=>{
                if(error.response.request.status === RESPONSE_CONFLICT)
                {
                    alert("인증번호가 틀리거나 만료되었습니다");
                }
            })
    }

    function resend()
    {
        customAxios.post("/register/resend",{email: email})
            .then((response)=>{
                if(response.data.code === RESPONSE_OK)
                {
                    alert("인증번호가 재전송되었습니다");
                }
            })
            .catch((error)=>{
                if(error.response.request.status === RESPONSE_SERV_UNAVAILABLE)
                {
                    alert("메일 전송에 실패했습니다");
                }
            })
    }

    return(
        <>
            <div>
                <input placeholder="인증번호" onChange={onNumberChange}/>
                <button type="button" onClick={authenticate}>인증</button>
                <button type="button" onClick={resend}>재전송</button>
            </div>
        </>
    );
}

export default UserAuthentication;