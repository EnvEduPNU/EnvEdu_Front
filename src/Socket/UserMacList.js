import SocketConnect from "./SocketConnect";

function UserMacList(props) {
    /**
     * 연관된 모든 기기에 대한 웹 소켓 연결 컴포넌트 생성 - SocketConnect
     */
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