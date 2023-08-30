import React, {useState} from "react";
import {customAxios} from "../Common/CustomAxios";

function MyData(){
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [checkedHeaders, setCheckedHeaders] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isFull, setIsFull] = useState([]);
    const [isShow, setIsShow] = useState(false);
    const [category, setCategory] = useState(false);

    function handleFullCheck(){
        setIsFull(!isFull)
        if (isFull)
            setSelectedItems([])
        else
            setSelectedItems(data)
    }

    function handleViewCheckBoxChange(item){
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    }

    function getMyData(type){
        let path = ''
        let username = localStorage.getItem('username');
        if (type === 'AIR')
            path = '/air-quality/mine?username='+username;
        else if (type === 'OCEAN')
            path = '/ocean-quality/mine?username='+username;

        customAxios.get(path)
            .then((jsonData)=>{
                jsonData = jsonData.data;
                console.log(jsonData)
                setData(jsonData);
                setFilteredData(jsonData);
                setSelectedOption(jsonData[0]);
                setIsFull(false);
                setIsShow(true);
                setSelectedItems([])
                setCategory(type)

                // Set the table headers dynamically
                const headers = Object.keys(jsonData[0]).filter((key) => key !== 'id');
                setHeaders(headers);
                const checkedHeaders = Object.keys(jsonData[0]).filter((key) => key !== 'id');
                setCheckedHeaders(checkedHeaders);
            });

    };
    return (
        <div>

            <div className="wrap-select-type">
                <div onClick={()=>getMyData('OCEAN')} className="select-type">
                    <span>수질 데이터 조회</span>
                </div>
                <div onClick={()=>getMyData('AIR')} className="select-type">
                    <span>대기질 데이터 조회</span>
                </div>
                {/* Render the rest of the component */}
            </div>
            <h3 className="air-div-full">저장한 공공데이터</h3>

            <div>
                <table border="1" className="air-div-full">
                    <thead>
                    <tr>
                        {headers.map((header) => (
                            <th key={header}>{header}</th>
                        ))}
                        {isShow &&
                            <th>
                                <input
                                    type="checkbox"
                                    onChange={() => handleFullCheck()}
                                    checked={isFull}
                                ></input>
                            </th>
                        }

                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.id}>
                            {headers.map((header) => (
                                <td key={header}>{item[header]}</td>
                            ))}
                            <td>
                                <input
                                    type="checkbox"
                                    name={item}
                                    checked={selectedItems.includes(item)}
                                    onChange={() => handleViewCheckBoxChange(item)}
                                ></input>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default MyData;