import { useForm } from 'react-hook-form';
import { customAxios } from '../../Common/CustomAxios';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './RegisterForm.css';

function RegisterForm() {
    const { state } = useLocation();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const [passwordCheck, setPasswordCheck] = useState('');

    useEffect(() => {
        if (state === null || state === undefined) {
            alert("잘못된 접근입니다");
            navigate("/");
        }
    }, []);

    function onSubmit(data) {
        if (data.password !== passwordCheck) {
            alert('비밀번호가 일치하는지 확인해주세요');
            return;
        }
        data.role = state.role;
        data.email = state.email;
        console.log(data)
        customAxios
            .post('/user', { ...data })
            .then(() => {
                alert("가입되었습니다");
                navigate("/");
            })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="formBody">
                <h1>회원가입</h1>
                <div className="input-box">
                    <input
                        className="registerInput"
                        placeholder="아이디: 5~20자"
                        {...register('username', {
                            required: { value: true, message: '아이디를 입력하세요' },
                        })}
                    />
                    {errors.username && (
                        <span style={{ color: 'red', fontSize: '13px' }}>
                            {errors.username.message}
                        </span>
                    )}
                </div>
                <div className="input-box">
                    <input
                        className="registerInput"
                        placeholder="비밀번호: 8~20자"
                        type="password"
                        {...register('password', {
                            required: { value: true, message: '비밀번호를 입력하세요' },
                        })}
                    />
                    {errors.password && (
                        <span style={{ color: 'red', fontSize: '13px' }}>
                            {errors.password.message}
                        </span>
                    )}
                </div>
                <div className="input-box">
                    <input
                        className="registerInput"
                        placeholder="비밀번호 확인"
                        type="password"
                        onChange={(e) => {
                            setPasswordCheck(e.target.value);
                        }}
                    />
                </div>
                <div className="input-box">
                    <input
                        className="registerInput"
                        placeholder="이메일"
                        type="email"
                        disabled={true}
                        value={state.email}
                    />
                </div>
                
                <div className="input-box">
                    {/**
                     * yyyy-mm-dd 형식 준수
                     */}
                    <input
                        className="registerInput"
                        placeholder="생년월일"
                        type="date"
                        {...register('birthday', {
                            required: { value: true, message: '생년월일을 입력하세요' },
                        })}
                    />
                    {errors.birthday && (
                        <span style={{ color: 'red', fontSize: '13px' }}>
                            {errors.birthday.message}
                        </span>
                    )}
                </div>
                <div className="input-box">
                    <input
                        className="registerInput"
                        placeholder="닉네임: 0~20자"
                        type="nickname"
                        {...register('nickname', {
                            required: { value: true, message: '닉네임을 입력하세요' },
                        })}
                    />
                    {errors.nickname && (
                        <span style={{ color: 'red', fontSize: '13px' }}>
                            {errors.nickname.message}
                        </span>
                    )}
                </div>
                <button type="submit" className="btn btn-secondary">
                    회원가입
                </button>
            </div>
        </form>
    );
}

export default RegisterForm;
