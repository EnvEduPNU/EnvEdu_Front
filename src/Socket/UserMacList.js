import SocketConnect from "./SocketConnect";

function UserMacList(props)
{
    return(
        <div>
            {
                props.mac.macList.map((elem, idx)=>
                    (<div key={idx}>
                        <SocketConnect mac={elem} username={props.mac.username}/>
                    </div>)
                )
            }
        </div>
    );
}

export default UserMacList;