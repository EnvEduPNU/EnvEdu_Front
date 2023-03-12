import {customAxios} from "../Common/CustomAxios";
import {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Button, Table} from "react-bootstrap";
import {RESPONSE_CONFLICT, RESPONSE_NOT_FOUND} from "../Common/Response";
import DataTable from "./DataTable";


function TestFetch()
{
    const headers = ["mac","temp", "pH", "hum", "hum_earth", "tur", "dust", "dox", "co2", "lux", "pre", "date"];
    const [data,setData] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [username, setUsername] = useState("");

    function submit()
    {
        const startDateString = startDate.toUTCString();
        const endDateString = endDate.toUTCString();

        customAxios.get(`/user/fetch`,{params:{startDate: startDateString, endDate: endDateString, username: username}})
            .then((response)=>{
                setData([...response.data.data]);
            })
            .catch((error)=>{
                if(error.response.request.status === RESPONSE_NOT_FOUND)
                {
                    alert("유저가 존재하지 않습니다");
                }
            })

    }

    function handleChange(e)
    {
        setUsername(e.target.value);
    }

    return(
        <div className="col-10 mx-auto pt-5">
                <input value={username} onChange={handleChange}/>
                    <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                    setStartDate(date);
                }}
                    timeInputLabel="Time:"
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    showTimeInput
                    />
                    <DatePicker
                    selected={endDate}
                    onChange={(date) => {
                    setEndDate(date);
                }}
                    timeInputLabel="Time:"
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    showTimeInput
                    />
                <Button onClick={submit} type="button">send</Button>
            {
                data.length === 0 ? (<></>) :
                    (
                        <Table>
                            <thead>
                            <tr>
                                {
                                    headers.map((elem,idx)=>
                                        (<th key={idx}>{elem}</th>)
                                    )
                                }
                            </tr>
                            </thead>
                            <DataTable data={data}/>
                        </Table>
                    )
            }
        </div>
    );
}

export default TestFetch;