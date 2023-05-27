import { useEffect, useState } from "react";
import { customAxios } from "../../Common/CustomAxios";
import DeviceListElem from "./DeviceListElem";
import { Table } from "react-bootstrap";

function DeviceList() {
    /**
     * 어드민이 기기를 관리하기 위한 컴포넌트
     * 현재 등록된 모든 기기의 MAC주소와 별칭, 현재 어떤 사용자에게 할당되어 있는지 확인 및 관리할 수 있음
     */
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