import { useState } from "react";
import { customAxios } from "../../Common/CustomAxios";
import { useNavigate } from "react-router-dom";


function AdminLogin() 
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function submit() 
    {
        customAxios.post("/login/admin", {username: username, password: password})
        .then(()=>navigate("/"));
    }

    return (
    <div>
        <input type="text" required={true} placeholder="아이디" onChange={(e)=>setUsername(e.target.value)}/>
        <input type="password" required={true} placeholder="비밀번호" onChange={(e)=>setPassword(e.target.value)}/>
        <button type="button" onClick={submit}>로그인</button>
    </div>
    );
}

export default AdminLogin;