import { useEffect } from "react";
import SocketConnect from "./SocketConnect";

function UserMacList(props) {
    return(
        <div>
            {
                props.elem.elements.map((info, idx)=>
                (<div key={idx}>
                    <SocketConnect mac={info.mac} name={info.deviceName} username={props.elem.username}/>
                </div>))
            }
        </div>
    );
}

export default UserMacList;