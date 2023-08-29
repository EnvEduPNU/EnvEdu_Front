import './search.scss';
import { customAxios } from '../Common/CustomAxios';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function Search() {
    const location = useLocation();
        const stationName = location.state.stationName;
        console.log(stationName);
        
    useEffect(() => {
        customAxios.get(`/air-quality/station?addr=${stationName}`)
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err));
    }, []);

    return(
        <div>
            <h4>측정소 목록 조회</h4>
            ...에 대한 검색 결과
        </div>
    )
}