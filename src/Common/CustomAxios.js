import axios from "axios";
import {
  RESPONSE_BAD_REQ,
  RESPONSE_FORBIDDEN,
  RESPONSE_UNAUTHORIZED,
} from "./Response";
import { decodeToken } from "react-jwt";

/**
 * 프로젝트 전체에서 사용되고 있는 axios
 */

export const customAxios = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  withCredentials: true,
});

customAxios.interceptors.request.use(function (config) {
  const Authorization = localStorage.getItem("access_token");
  config.headers["Content-Type"] = "application/json";
  config.headers["Authorization"] = Authorization;

  return config;
});

customAxios.interceptors.response.use(
  function (response) {
    if (response.headers["authorization"] !== undefined) {
      console.log("response는 성공");

      let accessToken = response.headers["authorization"];
      localStorage.setItem("access_token", accessToken);

      const decodedToken = decodeToken(accessToken);

      let username = decodedToken.sub;
      let role = decodedToken.role; // JWT의 role 클레임
      let expiredAt = new Date(decodedToken.exp * 1000); // JWT의 exp 클레임은 초 단위이므로 밀리초로 변환

      localStorage.setItem("username", username);
      localStorage.setItem("role", role);
      localStorage.setItem("expiredAt", expiredAt);
    }
    return response;
  },
  function (error) {
    if (error.response.request.status === RESPONSE_UNAUTHORIZED) {
      alert("로그인 해주세요");
      window.location.reload();
      localStorage.clear();
    } else if (error.response.request.status === RESPONSE_FORBIDDEN) {
      alert("권한이 없습니다");
    } else if (error.response.request.status === RESPONSE_BAD_REQ) {
      alert(error.response.data);
    }
    return Promise.reject(error);
  }
);
