import {useState} from "react";
import {Button} from "react-bootstrap";
import {customAxios} from "../../Common/CustomAxios";
import {decodeToken} from "react-jwt";

function RegisterStudent()
{
    const [username] = useState(localStorage.getItem("refresh") === null ? "" : decodeToken(localStorage.getItem("refresh")).username);
    const [studentUsername, setStudentUsername] = useState("");
    function send()
    {
        customAxios.post("/educator/student/add",{username: username, student: studentUsername}).then(()=>{alert("done");})
    }
    return(
        <>
            <input onChange={(e)=>{setStudentUsername(e.target.value)}}></input>
            <Button type="button" onClick={send}>send</Button>
        </>
    );
}

export default RegisterStudent;