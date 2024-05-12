import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { customAxios } from "../../Common/CustomAxios";
import "./LoginForm.scss";
import { PiPlant } from "react-icons/pi";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  function onSubmit(data) {
    customAxios
      .post("/login", { ...data })
      .then((response) => {
        console.log("로그인 성공", response.data);
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
        console.log("로그인 실패", error);
      });
  }

  return (
    <div className="login">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex" }}>
            <PiPlant size="35" color="#2F5F3A" />
            <h2
              style={{
                color: "#000",
                fontWeight: "bold",
                marginLeft: "0.3rem",
              }}
            >
              SEEd
            </h2>
          </div>
          <div className="id">
            <input
              className="loginInput"
              placeholder="ID"
              {...register("username", {
                required: { value: true, message: "아이디를 입력하세요" },
              })}
            />
            {errors.username && (
              <span style={{ color: "red", fontSize: "13px" }}>
                {errors.username.message}
              </span>
            )}
          </div>
          <div className="password">
            <input
              className="loginInput"
              placeholder="Password"
              type="password"
              {...register("password", {
                required: { value: true, message: "비밀번호를 입력하세요" },
              })}
            />
            {errors.password && (
              <span style={{ color: "red", fontSize: "13px" }}>
                {errors.password.message}
              </span>
            )}
          </div>
          <button type="submit" className="btn login-btn">
            로그인
          </button>
          <div className="find">
            <span>Don't have an account?</span>
            <a
              href="/auth"
              style={{ fontWeight: "bold", marginLeft: "0.3rem" }}
            >
              Sign in
            </a>
            <br />
            <span>Forgot your ID or PW?</span>
            <a
              href="/Find"
              style={{ fontWeight: "bold", marginLeft: "0.3rem" }}
            >
              아이디 / 비밀번호 찾기
            </a>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default LoginForm;
