import {useEffect, useState} from "react";
import {Button, OverlayTrigger, Popover} from "react-bootstrap";
import {Line} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const option = {
    responsive: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
};

const labels = ['', '', '', '', '', '', '', '', '', ''];


function SingleDataContainer(props) {
    const [value, setValue] = useState(-99999);
    const [graphData] = useState([]);
    const [seeGraph, setSeeGraph] = useState(false);

    useEffect(() => {
        if (props.type === "temp") {
            props.data.forEach((elem) => {
                if (elem.temp !== -99999) graphData.push(elem.temp)
            });
        } else if (props.type === "pH") {
            props.data.forEach((elem) => {
                if (elem.ph !== -99999) graphData.push(elem.ph)
            });
        } else if (props.type === "hum") {
            props.data.forEach((elem) => {
                if (elem.hum !== -99999) graphData.push(elem.hum)
            });
        } else if (props.type === "hum_earth") {
            props.data.forEach((elem) => {
                if (elem.hum_EARTH !== -99999) graphData.push(elem.hum_EARTH)
            });
        } else if (props.type === "tur") {
            props.data.forEach((elem) => {
                if (elem.tur !== -99999) graphData.push(elem.tur)
            });
        } else if (props.type === "dust") {
            props.data.forEach((elem) => {
                if (elem.dust !== -99999) graphData.push(elem.dust)
            });
        } else if (props.type === "dox") {
            props.data.forEach((elem) => {
                if (elem.dox !== -99999) graphData.push(elem.dox)
            });
        } else if (props.type === "co2") {
            props.data.forEach((elem) => {
                if (elem.co2 !== -99999) graphData.push(elem.co2)
            });
        } else if (props.type === "lux") {
            props.data.forEach((elem) => {
                if (elem.lux !== -99999) graphData.push(elem.lux)
            });
        } else if (props.type === "pre") {
            props.data.forEach((elem) => {
                if (elem.pre !== -99999) graphData.push(elem.pre)
            });
        }
    }, [])

    useEffect(() => {
        if (props.current !== null && props.current !== undefined) {
            if (props.type === "temp") {
                setValue(props.data[props.data.length - 1].temp);
                if (props.current.temp !== -99999) {
                    graphData.push(props.current.temp);
                }
            } else if (props.type === "pH") {
                setValue(props.data[props.data.length - 1].ph);
                if (props.current.ph !== -99999) {
                    graphData.push(props.current.ph);
                }
            } else if (props.type === "hum") {
                setValue(props.data[props.data.length - 1].hum);
                if (props.current.hum !== -99999) {
                    graphData.push(props.current.hum);
                }
            } else if (props.type === "hum_earth") {
                setValue(props.data[props.data.length - 1].hum_EARTH);
                if (props.current.hum_EARTH !== -99999) {
                    graphData.push(props.current.hum_EARTH);
                }
            } else if (props.type === "tur") {
                setValue(props.data[props.data.length - 1].tur);
                if (props.current.tur !== -99999) {
                    graphData.push(props.current.tur);
                }
            } else if (props.type === "dust") {
                setValue(props.data[props.data.length - 1].dust);
                if (props.current.dust !== -99999) {
                    graphData.push(props.current.dust);
                }
            } else if (props.type === "dox") {
                setValue(props.data[props.data.length - 1].dox);
                if (props.current.dox !== -99999) {
                    graphData.push(props.current.dox);
                }
            } else if (props.type === "co2") {
                setValue(props.data[props.data.length - 1].co2);
                if (props.current.co2 !== -99999) {
                    graphData.push(props.current.co2);
                }
            } else if (props.type === "lux") {
                setValue(props.data[props.data.length - 1].lux);
                if (props.current.lux !== -99999) {
                    graphData.push(props.current.lux);
                }
            } else if (props.type === "pre") {
                setValue(props.data[props.data.length - 1].pre);
                if (props.current.pre !== -99999) {
                    graphData.push(props.current.pre);
                }
            }


            if (graphData.length > 10) {
                graphData.splice(0, 1);
            }
        }
    }, [props.data])

    const dataElem = {
        labels,
        datasets: [
            {
                label: props.type,
                data: graphData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return (
        <div>
            <div className="d-flex justify-content-between">
                <div>
                <span className="border pe-2 ps-2 mb-2" style={{
                    display: "inline-block",
                    fontSize: "0.9em",
                    width: "8em",
                    backgroundColor: `${value === -99999 ? "rgb(192,192,192)" : "rgb(102,255,102)"}`
                }}>{props.type}</span>
                    &nbsp;&nbsp;
                    {
                        <span>{value === -99999 ? "N/A" : value}</span>
                    }
                </div>
                <div>
                    <OverlayTrigger
                        trigger="click"
                        placement="left"
                        defaultShow={false}
                        overlay={
                            <Popover id="popover-positioned-left">
                                <Popover.Header as="h3">{props.type}센서 보정하기</Popover.Header>
                                <Popover.Body>
                                    <Button
                                        onClick={() => props.sendFunction("{ENTER" + (props.type === "pH" ? "PH" : props.type === "tur" ? "TUR" : "DO") + "}")}>시작</Button>
                                    <br/>
                                    <Button
                                        onClick={() => props.sendFunction("{CAL" + (props.type === "pH" ? "PH" : props.type === "tur" ? "TUR" : "DO") + "}")}>보정</Button>
                                    <br/>
                                    <Button
                                        onClick={() => props.sendFunction("{EXIT" + (props.type === "pH" ? "PH" : props.type === "tur" ? "TUR" : "DO") + "}")}>종료</Button>
                                </Popover.Body>
                            </Popover>
                        }
                    >
                        {(props.type === "pH" || props.type === "tur" || props.type === "dox") && value !== -99999 ?
                            <span className="border" style={{fontSize: "0.8em"}}>보정하기</span> : <></>}
                    </OverlayTrigger>

                    <div style={{cursor: "pointer", display: "inline-block"}} onClick={() => {
                        setSeeGraph(!seeGraph);
                    }}>
                        📈
                    </div>
                </div>
            </div>
            <div>
                {
                    seeGraph === true && props.data.length !== 0 ?
                        (
                            <div>
                                <Line options={option} data={dataElem} width="700" height="500"/>
                            </div>
                        )
                        : (<></>)

                }
            </div>
        </div>
    );
}

export default SingleDataContainer;

