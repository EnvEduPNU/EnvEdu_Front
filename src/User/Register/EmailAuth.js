import { customAxios } from "../../Common/CustomAxios";
import {useEffect, useState} from "react";
import LoadingSpinner from "../../Common/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";


function EmailAuth() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [spinner, setSpinner] = useState(false);
    const [email, setEmail] = useState("");
    const [authNum, setAuthNum] = useState("");

    useEffect(()=>{
        if(state === null || state === undefined) {
            alert("잘못된 접근입니다");
            navigate("/");
        }
    },[])

    function sendAuthNum() {
        setSpinner(true);
        customAxios.post("/auth", {email: email}).then(() => { 
            setSpinner(false);
            alert("인증번호를 메일로 전송했습니다"); 
        }).finally(()=>setSpinner(false));
    }

    function confirmAuthNum() {
        setSpinner(true);
        customAxios.get("/auth", {params: {email: email, authNum: authNum}}).then(()=>{
            alert("인증이 완료되었습니다");
            navigate("/register", {state: {role: state.role, email: email}}); 
        }).finally(()=>setSpinner(false));
    }

    return (
        <div>
            <h2>이메일 인증({state.role.replace(/^ROLE_/, "")})</h2>
            {
                spinner === true ? (<LoadingSpinner/>) : (<></>)
            }
            <div style={spinner ? {pointerEvents: "none", opacity: "0.4"} : {}}>
                <div>
                    <input type="email" onChange={(e)=>setEmail(e.target.value)} placeholder="이메일" /><button type="button" onClick={sendAuthNum}>인증 번호 (재)전송</button>
                </div>
                <div>
                    <input type="text" onChange={(e)=>setAuthNum(e.target.value)} placeholder="인증번호" /><button type="button" onClick={confirmAuthNum}>인증하기</button>
                </div>
            </div>
        </div>
    );
}

export default EmailAuth;