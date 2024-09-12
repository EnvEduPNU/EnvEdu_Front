import { customAxios } from '../../Common/CustomAxios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './search.scss';

export default function Search() {
    const districts = {
        "서울" : ["종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구", "성북구", "강북구", "도봉구", "노원구", "은평구", "서대문구", "마포구", "양천구", "강서구", "구로구", "금천구", "영등포구", "동작구", "관악구", "서초구", "강남구", "송파구", "강동구"],
        "부산" : ["중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구", "해운대구", "사하구", "금정구", "강서구", "연제구", "수영구", "사상구", "기장군"],
        "대구" : ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군", "군위군"],
        "인천" : ["중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"],
        "광주" : ["동구", "서구", "남구", "북구", "광산구"],
        "대전" : ["동구", "중구", "서구", "유성구", "대덕구"],
        "울산" : ["중구", "남구", "동구", "북구", "울주군"],
        "세종" : [],
        "경기" : ["고양", "수원", "용인", "과천", "광명", "광주", "구리", "군포", "김포", "남양주", "동두천", "부천", "성남", "시흥", "안산", "안성", "안양", "양주", "여주", "오산", "의왕", "의정부", "이천", "파주", "평택", "포천", "하남", "화성", "가평군", "양평군", "연천군"],
        "강원" : ["강릉", "동해", "삼척", "속초", "원주", "춘천", "태백", "고성군", "양구군", "양양군", "영월군", "인제군", "정선군", "철원군", "평창군", "홍천군", "화천군", "횡성군"],
        "충북" : ["제천", "청주", "충주", "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "증평군", "진천군"], 
        "충남" : ["계룡", "공주", "논산", "당진", "보령", "서산", "아산", "천안", "금산군", "부여군", "서천군", "예산군", "청양군", "태안군", "홍성군"],
        "전북" : ["군산", "김제", "남원", "익산", "전주", "정읍", "고창군", "무주군", "부안군", "순창군", "완주군", "임실군", "장수군", "진안군"],
        "전남" : ["목포", "여수", "순천", "나주", "광양", "담양군", "곡성군", "구례군", "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군", "영암군", "무안군", "함평군", "영광군", "장성군", "완도군"],
        "경북" : ["경산", "경주", "구미", "김천", "문경", "상주", "안동", "영주", "영천", "포항", "고령군", "봉화군", "성주군", "영덕군", "영양군", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군"],
        "경남" : ["창원", "거제", "김해", "밀양", "사천", "양산", "진주", "통영", "거창군", "고성군", "남해군", "산청군", "의령군", "창녕군", "하동군", "함안군", "함양군", "합천군"],
        "제주" : ["서귀포시", "제주시"]
    }

    const [location, setLocation] = useState("부산");
    const [subLocation, setSubLocation] = useState("");
    const [stations, setStations] = useState([]);

    useEffect(() => {
        let path = ``;
        if (subLocation === "") {
            path = `/air-quality/station?addr=${location}`;
        } else {
            path = `/air-quality/station?addr=${location}` + " " + `${subLocation}`;
        }
        customAxios.get(path)
        .then((res) => {setStations(res.data); console.log(res.data);})
        .catch((err) => console.log(err));
    }, [location, subLocation]);

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
        //setSubLocation(districts[e.target.value][0]);
        setSubLocation("");
    }

    const handleSubLocationChange = (e) => {
        setSubLocation(e.target.value);
    }

    return(
        <div className='openAPI-search'>
            <h4>측정소 목록 조회</h4>

            <div style={{marginTop: '2rem'}}>
                <label style={{fontWeight: '600'}}>지역 선택</label>
                <select 
                    onChange={handleLocationChange} 
                    value={location}>
                    {Object.keys(districts).map((district) => (
                        <option key={district} value={district}>{district}</option>
                    ))}
                </select>
                
                {location !== "세종" &&
                    <select 
                        onChange={handleSubLocationChange} 
                        value={subLocation}
                        disabled={!location}>
                            <option value="">전체</option>
                        {districts[location] && districts[location].map((subLocation) => (
                            <option key={subLocation} value={subLocation}>{subLocation}</option>
                        ))}
                    </select>
                }
            </div>
            
            {location && 
                <div style={{marginTop: '2rem'}}>
                    <span style={{ color: '#f06313', fontWeight: '600' }}>{location} {subLocation}</span>에 대한 검색 결과
                </div>
            }

            <div style={{marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', width: '100%'}}>
                {stations.map((station, index) => (
                    <div key={index} className="station-container">
                        <div>
                            <span>측정소명</span> 
                            <Link to={"/openAPI/past"} state={{ stationName: station.stationName, addr: station.addr }}>{station.stationName}</Link>
                        </div>
                            
                        <div>
                            <span>측정소 위치</span>{station.addr}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}