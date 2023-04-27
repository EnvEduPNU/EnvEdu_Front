import { useEffect, useState } from "react";
import { customAxios } from "../../Common/CustomAxios";
import DeviceListElem from "./DeviceListElem";
import { Table } from "react-bootstrap";

function DeviceList() {
    const [devices, setDevices] = useState([]);
    useEffect(() => {
        customAxios.get("/admin/devices").then((response) => {
            setDevices([...response.data.list]);
        })
    }, []);

    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        <th>Mac</th>
                        <th>기기 명칭</th>
                        <th>현재 사용자</th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        devices.map((elem, idx) => (<DeviceListElem key={idx} elem={elem} />))
                    }
                </tbody>
            </Table>
        </div>
    );
}

export default DeviceList;