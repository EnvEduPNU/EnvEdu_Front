import './Training.scss';
import styled from 'styled-components';
import { LuSprout } from "react-icons/lu";
import { MdFileDownload } from "react-icons/md";

const FileContainer = styled.div`
    text-align: left;
    padding: 0.2rem 0.5rem;
    font-size: 0.9em;
    background: #f2f2f2;
    width: 25rem;
    border-radius: 0.3125rem;
    margin-bottom: 0.5rem;
`

export default function Training3() {
    return (
        <div className='training'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <LuSprout size="45"  color="green" />
                <span style={{ fontWeight: 'bold', fontSize: '1.5em' }}>일시 및 장소</span>
            </div>

            <hr />

            <p className='training-text'>
                2020년 11월 10일 (월) 오후 4시 ~ 6시, 부산 환경교육센터
            </p>
        </div>
    )
}