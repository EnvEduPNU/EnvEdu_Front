import {useEffect, useState} from "react";
import {customAxios} from "../Common/CustomAxios";
import UserMacList from "./UserMacList";

function ConnectPage() {
    const [connectableSocket, setConnectableSocket] = useState([]);

    const style = {
        border: '1px solid black',
        margin: "2em", 
        paddingLeft: "5em", 
        paddingRight: "5em"
    }

    useEffect(()=>{
        /**
         * 자신과 연관된 기기의 정보를 가져옴
         * 학생의 경우, 자신에게 등록된 기기
         * 교사의 경우, 자신에게 등록된 기기 + 자신이 지도하는 모든 학생에게 등록된 기기
         */
        customAxios.get(`/seed/device`)
            .then((response)=>{
                setConnectableSocket(response.data.relatedUserDeviceList);
            })
    },[]);

    return(
        <div style={{fontSize: "1.5em"}}>
            <div className="row d-flex justify-content-center">
                연결된 기기 목록
            </div>
            {
                connectableSocket.map((elem,idx)=>
                    (<div key={idx}>
                        {elem.username}
                        <div style={style} key={idx}>
                            <UserMacList key={idx} elem={elem}/>
                        </div>
                    </div>)
                )
            }
        </div>
    );
}

export default ConnectPage;