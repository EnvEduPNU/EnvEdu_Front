import { useState, useEffect } from "react";

export default function MeasureSub(props) {
    const dataTypes = ["temp", "pH", "hum", "hum_earth", "tur", "dust", "dox", "co2", "lux", "pre"];
    const [value, setValue] = useState(-99999);

    /**
     * 그래프를 렌더링하기 위한 데이터
     */
    const [graphData] = useState([]);

    useEffect(() => {
        /**
         * 유효하지 않은 데이터를 제외한 값을 이용해 그래프 생성
         * 컴포넌트가 처음 생성될 때 받았던 데이터 중 유효한 값을 graphData에 추가
         */
        if (dataTypes.includes(props.type)) {
            props.data.forEach((elem) => {
                const propValue = elem[props.type];
                if (propValue !== -99999) {
                    graphData.push(propValue);
                }
            });
        }
    }, [])

    useEffect(() => {
        /**
         * 데이터를 받았을 때, 유효한 값이면 마지막으로 받은 값 갱신
         * graphData에도 추가
         */
        const propKey = props.type;
    
        if (props.current !== null && props.current !== undefined) {
            const propValue = props.current[propKey];
            if (propValue !== -99999) {
                graphData.push(propValue);
            }
    
            const lastData = props.data[props.data.length - 1][propKey];
            setValue(lastData);
    
            if (graphData.length > 10) {
                graphData.splice(0, 1);
            }
        }
    }, [props.data, props.type, props.current]);

    /*일시 정지*/
    const handlePause = () => {

    }

    /*기록하기*/
    const handleRecord = () => {

    }

    console.log(props.type)
    console.log(graphData);
    console.log(value);
    
    return(
        <div>
            <button onClick={handlePause}>일시정지</button>
            <button onClick={handleRecord}>기록하기</button>
            {value !==-99999 && value}
        </div>
    )
}