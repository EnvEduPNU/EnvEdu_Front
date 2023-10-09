import { useState, useEffect } from "react";
import './sample.scss'
import { customAxios } from "../Common/CustomAxios";
//import UserMacList from "./UserMacList";
import SampleSocket from "./sample_socket";

export default function Sample() {
    // click한 div의 index 저장하는 배열
    const [clickedIndexes, setClickedIndexes] = useState([]);

    const handleShowing = (index) => {
        if (clickedIndexes.includes(index)) {
            setClickedIndexes(clickedIndexes.filter((i) => i !== index));
        } else {
            setClickedIndexes([...clickedIndexes, index]);
        }
    };

    const [connectableSocket, setConnectableSocket] = useState([]);

    useEffect(()=>{
        /**
         * 자신과 연관된 기기의 정보를 가져옴
         * 학생의 경우, 자신에게 등록된 기기
         * 교사의 경우, 자신에게 등록된 기기 + 자신이 지도하는 모든 학생에게 등록된 기기
         */
        customAxios.get(`/seed/device`)
            .then((response)=>{
                setConnectableSocket(response.data.relatedUserDeviceList);
                console.log(response.data.relatedUserDeviceList);
            })
    },[]);
    /*
    const [connectableSocket, setConnectableSocket] = useState([
        { username: "user1", elements: [{ name: 'device1', mac: 'AA:BB:CC:DD:EE:FF' }] },
        { username: "user2", elements: [{ name: 'device2', mac: 'AA:BB:CC:DD:EE:FF' }] },
        { username: "user3", elements: [{ name: 'device3', mac: 'AA:BB:CC:DD:EE:FF' }] },
        { username: "user4", elements: [{ name: 'device4', mac: 'AA:BB:CC:DD:EE:FF' }] }
    ]);
    */
   
    return(
        <div style={{fontSize: "1.5em"}} className="sample">
            <div className="row d-flex justify-content-center">
                연결된 기기 목록
            </div>
            {
                connectableSocket.map((elem,idx)=>
                    (<div key={idx}>
                        {/*}
                        <div style={{display: 'flex', justifyContent: 'flex-end', padding: '0 2em', marginTop: '1.25rem'}}>
                            <div style={{background: '#D9DCFF', border: 'none', borderRadius: '2.5rem', padding: '0.3rem 1rem', fontWeight: 'bold', fontSize: '1rem'}}>
                                내 계정 : {elem.username}
                            </div>
                        </div>
                        */}
                        {/*
                        <div style={style} key={idx}>
                            <UserMacList key={idx} elem={elem}/>
                        </div>
                        */}
                    </div>)
                )
            }

            {/*수정 필요*/}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem'}}>
                <div className='notification_container'>
                    {connectableSocket.map((item, index) => (
                        <div style={{}}>
                            <div style={{width: '100%', height: '100%'}}>
                                {item.elements.map((element, elementIndex) => (
                                    <div key={index} className={`notification_list ${clickedIndexes.includes(index) ? 'opened' : ''}`}>
                                        <div 
                                            key={elementIndex}
                                            className='notification_element' 
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'space-between',
                                                borderTopRightRadius: clickedIndexes.includes(index - 1) || index == 0 ? '1.875rem' : 0,
                                                borderTopLeftRadius: clickedIndexes.includes(index - 1) || index == 0 ? '1.875rem' : 0,
                                                borderBottomRightRadius: connectableSocket.length - 1  == index || clickedIndexes.includes(index) ? '1.875rem' : 0,
                                                borderBottomLeftRadius: connectableSocket.length - 1 == index || clickedIndexes.includes(index) ? '1.875rem' : 0,
                                        }}>
                                            <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    fontSize: '1.25rem',
                                                    width: '15rem',
                                                    height:' 2rem',
                                                    borderRadius: '1.25rem',
                                                    background: '#D9DCFF'
                                                }}>
                                                    {element.deviceName}
                                            </div>
                                            
                                            <div style={{display: 'flex'}}>
                                                <div style={{
                                                    textAlign: 'center',
                                                    background: '#CBE0FF',
                                                    width: '10.875rem',
                                                    height: '2.375rem,',
                                                    borderRadius: '1.25rem',
                                                    fontSize: '1.25rem',
                                                    marginRight: '1rem'
                                                }}>
                                                    {item.username}
                                                </div>
                                            
                                                <div className="showBtn" onClick={() => handleShowing(index)}>
                                                    {clickedIndexes.includes(index) ? '닫기' : '보기'}
                                                </div>
                                            </div>
                                        
                                        </div>
                                        
                                    {clickedIndexes.includes(index) &&
                                        <SampleSocket mac={element.mac} name={element.deviceName} username={item.username} clickedIndexes={clickedIndexes} />
                                    }   

                                    {/*
                                    <div style={{BorderBottomLeftRadius: '1.875rem', borderBottomLeftRadius: '1.875rem'}}>
                                        {clickedIndexes.includes(index) &&
                                            item.content.map((notice) => (
                                            <div key={notice.id} className="isClickedDiv">
                                                <span>{notice.id}</span>
                                                <div style={{ width: '90%', marginLeft: '3.75%' }}>
                                                <a href={notice.link}>{notice.title}</a>
                                                </div>
                                                <span>{notice.date}</span>
                                            </div>
                                            ))}
                                    </div>
                                    */}
                                    </div>
                                ))}

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        
    )
}