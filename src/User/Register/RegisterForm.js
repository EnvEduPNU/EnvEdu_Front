import { useForm } from 'react-hook-form';
import { customAxios } from '../../Common/CustomAxios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [passwordCheck, setPasswordCheck] = useState('');
  const [role, setRole] = useState('');
  const [studentGroup, setStudentGroup] = useState('');

  async function onSubmit(data) {
    if (data.password !== passwordCheck) {
      alert('비밀번호가 일치하는지 확인해주세요');
      return;
    }

    const registrationData = { ...data, role: role };

    await customAxios
      .post('/api/user/register', registrationData)
      .then(() => {
        alert('가입되었습니다');
        navigate('/');
      })
      .catch((error) => {
        console.error(error.response.data);
        alert(`${error.response.data}이 이미 존재합니다.`);
      });
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        height: 1000,
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          style={{
            width: '400px',
            marginTop: '0rem',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
          }}
        >
          <Typography
            variant="h3"
            style={{ textAlign: 'center', marginBottom: '20px' }}
          >
            회원가입
          </Typography>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              아이디
            </label>
            <input
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginTop: '4px',
              }}
              placeholder="아이디: 5~20자"
              {...register('username', {
                required: '아이디를 입력하세요',
                minLength: {
                  value: 5,
                  message: '아이디는 5자 이상이어야 합니다.',
                },
                maxLength: {
                  value: 20,
                  message: '아이디는 20자를 초과할 수 없습니다.',
                },
              })}
            />
            {errors.username && (
              <span style={{ color: 'red', fontSize: '12px' }}>
                {errors.username.message}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              비밀번호
            </label>
            <input
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginTop: '4px',
              }}
              placeholder="비밀번호: 8~20자"
              type="password"
              {...register('password', {
                required: '비밀번호를 입력하세요',
                minLength: {
                  value: 8,
                  message: '비밀번호는 8자 이상이어야 합니다.',
                },
                maxLength: {
                  value: 20,
                  message: '비밀번호는 20자를 초과할 수 없습니다.',
                },
              })}
            />
            {errors.password && (
              <span style={{ color: 'red', fontSize: '12px' }}>
                {errors.password.message}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              비밀번호 확인
            </label>
            <input
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginTop: '4px',
              }}
              placeholder="비밀번호 확인"
              type="password"
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              이메일
            </label>
            <input
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginTop: '4px',
              }}
              placeholder="이메일"
              type="email"
              {...register('email', {
                required: '이메일을 입력하세요',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: '유효한 이메일 주소를 입력하세요',
                },
              })}
            />
            {errors.email && (
              <span style={{ color: 'red', fontSize: '12px' }}>
                {errors.email.message}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              직업 선택
            </label>
            <select
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginTop: '4px',
                color: role ? '#000' : '#999',
              }}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">클릭하세요</option>
              <option value="ROLE_EDUCATOR">선생님</option>
              <option value="ROLE_STUDENT">학생</option>
            </select>
            {!role && (
              <span style={{ color: 'red', fontSize: '12px' }}>
                직업을 선택하세요.
              </span>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              학교 선택
            </label>
            <select
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginTop: '4px',
                color: role ? '#000' : '#999',
              }}
              value={studentGroup}
              onChange={(e) => setStudentGroup(e.target.value)}
            >
              <option value="">클릭하세요</option>
              <option value="부산중">부산중</option>
              <option value="광안중">광안중</option>
              <option value="부산고">부산고</option>
            </select>
            {!studentGroup && (
              <span style={{ color: 'red', fontSize: '12px' }}>
                학교를 선택하세요.
              </span>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              생년월일
            </label>
            <input
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginTop: '4px',
              }}
              type="date"
              {...register('birthday', {
                required: '생년월일을 입력하세요',
              })}
            />
            {errors.birthday && (
              <span style={{ color: 'red', fontSize: '12px' }}>
                {errors.birthday.message}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              닉네임
            </label>
            <input
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginTop: '4px',
              }}
              placeholder="닉네임: 0~20자"
              {...register('nickname', {
                required: '닉네임을 입력하세요',
                maxLength: {
                  value: 20,
                  message: '닉네임은 20자를 초과할 수 없습니다.',
                },
              })}
            />
            {errors.nickname && (
              <span style={{ color: 'red', fontSize: '12px' }}>
                {errors.nickname.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '4px',
              backgroundColor: '#1976d2',
              color: '#ffffff',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
