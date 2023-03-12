import {useForm} from 'react-hook-form';
import {
    RESPONSE_BAD_REQ,
    RESPONSE_CONFLICT,
    RESPONSE_OK,
    RESPONSE_SERV_UNAVAILABLE,
} from '../../Common/Response';
import {customAxios} from '../../Common/CustomAxios';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import {ROLE} from '../../Common/Role';
import './RegisterForm.css';

function RegisterForm() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    const navigate = useNavigate();

    const [passwordCheck, setPasswordCheck] = useState('');

    function onSubmit(data) {
        if (data.password === passwordCheck) {
            customAxios
                .post('/register', {...data})
                .then((response) => {
                    if (response.data.code === RESPONSE_OK) {
                        alert(
                            '입력하신 메일 주소로 인증번호를 전송했습니다. 가입 완료를 위해 인증번호를 입력해주세요'
                        );
                        navigate('/register/authentication', {
                            state: {
                                username: data.username,
                                email: data.email,
                                userRole: ROLE[0],
                            },
                        });
                    }
                })
                .catch((error) => {
                    if (error.response.request.status === RESPONSE_BAD_REQ) {
                        alert('형식에 맞게 입력해주세요');
                    } else if (error.response.request.status === RESPONSE_CONFLICT) {
                        alert('이미 사용된 아이디 또는 이메일입니다');
                    } else if (
                        error.response.request.status === RESPONSE_SERV_UNAVAILABLE
                    ) {
                        alert('메일 전송에 실패했습니다');
                    } else {
                        alert(error.response.request.status);
                    }
                });
        } else {
            alert('비밀번호를 확인해주세요');
        }
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
                            required: {value: true, message: '아이디를 입력하세요'},
                        })}
                    />
                    {errors.username && (
                        <span style={{color: 'red', fontSize: '13px'}}>
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
                            required: {value: true, message: '비밀번호를 입력하세요'},
                        })}
                    />
                    {errors.password && (
                        <span style={{color: 'red', fontSize: '13px'}}>
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
                        {...register('email', {
                            required: {value: true, message: '이메일을 입력하세요'},
                        })}
                    />
                    {errors.email && (
                        <span style={{color: 'red', fontSize: '13px'}}>
            {errors.email.message}
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
