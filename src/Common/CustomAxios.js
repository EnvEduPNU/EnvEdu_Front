import axios from "axios";
import {RESPONSE_FORBIDDEN, RESPONSE_UNAUTHORIZED} from "./Response";
import {isExpired} from "react-jwt";

export const customAxios = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
        accept: "application/json"
    },
    withCredentials: true
})

customAxios.interceptors.request.use(
    function (config)
    {
        config.headers.ContentType = "application/json; charset=utf-8";
        config.headers.authorization = localStorage.getItem("jwt");
        if(isExpired(localStorage.getItem("jwt")))
        {
            if(localStorage.getItem("refresh") != null)
            {
                config.headers.refresh = localStorage.getItem("refresh");
            }
        }
        return config;
    }
)

customAxios.interceptors.response.use(
    function (response)
    {
        if(response.headers['authorization'] !== undefined)
        {
            localStorage.setItem("jwt", response.headers['authorization']);
        }
        if(response.headers['refresh'] !== undefined)
        {
            localStorage.setItem("refresh", response.headers['refresh']);
        }
        return response;
    },
    function (error) {
        if (error.response.request.status === RESPONSE_UNAUTHORIZED)
        {
            alert("로그인 해주세요");
            localStorage.clear();
        }
        else if(error.response.request.status === RESPONSE_FORBIDDEN)
        {
            alert("권한이 없습니다");
        }
        else {
            alert(error.response.data);
        }
        return Promise.reject(error);
    }
);