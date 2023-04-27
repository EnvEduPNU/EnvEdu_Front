import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {customAxios} from "../../Common/CustomAxios";
import './LoginForm.css'

function LoginForm()
{
    const {register,handleSubmit,formState: {errors}} = useForm();
    const navigate = useNavigate();

    function onSubmit(data)
    {
        customAxios.post("/login",{...data})
            .then(()=> {
                navigate("/");
                window.location.reload();
            })
    }

    return (
        <>
        
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                <h1>로그인</h1>
                <div className="id">
                    <input className="loginInput" placeholder="아이디" {...register("username", {required: {value: true, message: "아이디를 입력하세요"}})}/>
                    {errors.username && <span style={{color:'red', fontSize:"13px"}}>{errors.username.message}</span>}
                </div>
                <div className="password">
                    <input className="loginInput" placeholder="비밀번호" type="password" {...register("password", {required: {value: true, message: "비밀번호를 입력하세요"}})}/>
                    {errors.password && <span style={{color:'red', fontSize:"13px"}}>{errors.password.message}</span>}
                </div>
                <button type="submit" className="btn btn-secondary">로그인</button>
                <div className="find">
                    <a href="/Find">아이디 / 비밀번호 찾기</a>
                    <a href="/Register">회원가입</a>
                </div>
                </fieldset>
            </form>
            
        </>
    );
}

export default LoginForm;