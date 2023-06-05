
import React from "react";
import {FadeLoader} from "react-spinners";

function LoadingSpinner(){
    /**
     * 서버로 요청을 보낼 때, 버튼 중복 클릭을 방지하기 위한 로딩 스피너
     */
    return(
        <div className="contentWrap">
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <FadeLoader
                    color="#C63DEE"
                    height={15}
                    width={5}
                    radius={2}
                    margin={2}
                />
            </div>
        </div>
    );
}

export default LoadingSpinner;