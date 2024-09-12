import { useState } from "react";
import { customAxios } from "../../Common/CustomAxios";
import { useNavigate } from "react-router-dom";
import { PiPlant } from "react-icons/pi";

import '../../User/Login/LoginForm.scss';

function AdminLogin() 
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function submit() 
    {
        customAxios.post("/login/admin", {username: username, password: password})
        .then(()=>{
            navigate("/");
            window.location.reload();
        });
    }

    return (
        <div className="login">  
            <form>
                <fieldset style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex' }}>
                        <PiPlant size="35" color="#2F5F3A" />
                        <h2 style={{ color: '#000', fontWeight: 'bold', marginLeft: '0.3rem' }}>SEEd</h2>
                    </div>
                    <div className="id">
                        <input className="loginInput" placeholder="ID" onChange={(e)=>setUsername(e.target.value)}/>
                    </div>
                    <div className="password">
                        <input className="loginInput" placeholder="Password" type="password" onChange={(e)=>setPassword(e.target.value)}/>
                    </div>
                    <button type="submit" className="btn login-btn" onClick={submit}>로그인</button>
                </fieldset>
            </form>
        </div>
    );
}

export default AdminLogin;