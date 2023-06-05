function DataList(props)
{
    /**
     * src/Test에 있는 모든 컴포넌트는 테스트에 사용됐던 컴포턴트
     * 삭제해도 무관
     */
    return(
        <tr>
            <td>{props.data.mac}</td>
            <td>{props.data.temp}</td>
            <td>{props.data.ph}</td>
            <td>{props.data.hum}</td>
            <td>{props.data.hum_EARTH}</td>
            <td>{props.data.tur}</td>
            <td>{props.data.dust}</td>
            <td>{props.data.dox}</td>
            <td>{props.data.co2}</td>
            <td>{props.data.lux}</td>
            <td>{props.data.pre}</td>
            <td>{props.data.date}</td>
        </tr>
    );
}

export default DataList;