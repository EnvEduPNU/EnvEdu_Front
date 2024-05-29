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
  config.headers.ContentType = "application/json; charset=utf-8";
  // config.headers.authorization = localStorage.getItem("jwt");
  return config;
});

customAxios.interceptors.response.use(
  // 백엔드에서 구현된 것은 처음 로그인 할때 jwt 토큰에 유저 정보만 보내는 것
  // 실제적인 인증은 쿠키로 보낸 RefreshToken으로 인증하고 유효기간은 1일임
  // 즉, 실제적인 토큰의 유효기간은 1일이고 보낸 AccessToken은 그냥 유저정보를 위한것
  // AccessToken은 3분의 유효기간을 가지고 있지만 실제적으로 쿠키로 백에서 인증 로직을 짰기 때문에
  // 1일의 유효기간으로 봐도 됨
  function (response) {
    if (response.headers["authorization"] !== undefined) {
      console.log("response는 성공");

      let accessToken = response.headers["authorization"];
      localStorage.setItem("access_token", accessToken);

      let username = decodeToken(accessToken).user_info.username;
      let role = decodeToken(accessToken).user_info.role;
      let expiredAt = new Date(decodeToken(accessToken).exp * 1000);

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
