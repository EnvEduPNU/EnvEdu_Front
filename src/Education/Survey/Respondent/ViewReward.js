import { useLocation } from "react-router-dom";
import { IoMdDownload } from "react-icons/io";

export default function ViewReward() {
    const location = useLocation();
    const state = location.state || {};

    console.log(state.imgUrl);

    return(
        <div>
            <span style={{ fontWeight: 'bold' }}>설문에 참여해주셔서 감사합니다.</span>
            <div style={{
                marginTop: '1rem',
                flexDirection: 'column',
                display:'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#f1f1f1',
                borderRadius: '0.625rem', 
                padding: '1rem',
            }}>
                <img 
                    src={state.imgUrl} 
                    alt="관리자에게 문의해 주세요." 
                    style={{ width: '30rem', borderRadius: '0.625rem' }}
                />
 
                <div style={{ width: '30rem', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', fontSize: '1.25em' }}>
                    <a href={state.imgUrl} download="reward.jpg" style={{ textDecoration: 'none' }}>
                        <button style={{ border: 'none', background: 'rgb(94, 44, 237)', borderRadius: '1.25rem', width: '10rem', color: '#fff' }}>
                            <IoMdDownload/> Download
                        </button>
                    </a>
                </div>
            </div>
        </div>
    )
}