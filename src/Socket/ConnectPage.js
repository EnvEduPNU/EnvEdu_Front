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
        customAxios.get(`/user/device`)
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