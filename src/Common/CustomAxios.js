import axios from "axios";
import {RESPONSE_BAD_REQ, RESPONSE_FORBIDDEN, RESPONSE_UNAUTHORIZED} from "./Response";
import {decodeToken} from "react-jwt";

export const customAxios = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    withCredentials: true
})

customAxios.interceptors.request.use(
    function (config) {
        config.headers.ContentType = "application/json; charset=utf-8";
        config.headers.authorization = localStorage.getItem("jwt");
        return config;
    }
)

customAxios.interceptors.response.use(
    function (response) {
        if(response.headers['authorization'] !== undefined) {
            let accessToken = response.headers['authorization'];
            localStorage.setItem("access_token", accessToken);
            
            let username = decodeToken(accessToken).user_info.username;
            let role = decodeToken(accessToken).user_info.role;

            localStorage.setItem("username", username);
            localStorage.setItem("role", role);
        }
        return response;
    },
    function (error) {
        if (error.response.request.status === RESPONSE_UNAUTHORIZED) {
            alert("로그인 해주세요");
            window.location.reload();
            localStorage.clear();
        }
        else if(error.response.request.status === RESPONSE_FORBIDDEN) {
            alert("권한이 없습니다");
        }
        else if(error.response.request.status === RESPONSE_BAD_REQ) {
            alert(error.response.data);
        }
        return Promise.reject(error);
    }
);