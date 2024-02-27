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

export default function Training1() {
    return (
        <div className='training'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <LuSprout size="45"  color="green" />
                <span style={{ fontWeight: 'bold', fontSize: '1.5em' }}>개요</span>
            </div>

            <hr />

            <p className='training-text'>
                스마트 환경교육 연수는 환경 교육에 대한 이해를 고취시키고 교육과정 기반의 환경교육 프로그램 활용을 위한 스마트 환경모니터링 킷의 현장 보급과 확산에 있다. 따라서 스마트 측정기기에 대한 활용교육과 함께 환경교육프로그램 활용에 대한 현장 교사들의 의견을 수렴하여 학교현장에서 실제 적용가능하고 활용성이 높은 교육자료로서 현장적용 가능성을 검증한다. 이를 기반으로 환경교육에서의 스마트 측정기기 활용방법과 적용에 대한 이해를 돕고 학생들의 수준에 맞는 스마트 기기 활용 교육을 학교 현장에 확산하고자 한다.
                <br/>
                이를 위해 개발된 교육프로그램을 참여 교사들과 협업하여 각 학교급별 대상별[유초등(스토리텔링북), 중고등(온라인/오프라인 학습자료), 교사(지도사)]로 적용하여 스마트 환경교육 보급의 토대를 마련하고 아울러 연구과정에서 개발된 효과검증 도구(검사지)를 함께 활용하여 적용된 프로그램의 효과를 과학적으로 검증할 수 있도록 지원한다.
            </p>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <LuSprout size="45"  color="green" />
                <span style={{ fontWeight: 'bold', fontSize: '1.5em' }}>연수 자료</span>
            </div>

            <hr />

            <div>
                <a href="https://drive.google.com/file/d/1Y-uOS0Pl5hmvdoN1EKOPFl5hgvQJ3xK2/view">
                    <FileContainer>
                        <MdFileDownload size="20" /> 환경교육 프로그램 적용 연수 교재
                    </FileContainer>
                </a>
                <a href="https://drive.google.com/file/d/1oa0fglDpC8NTq9w_wYuDiOejYnqVFOSw/view">
                    <FileContainer>
                        <MdFileDownload size="20" /> 환경교육을 위한 스마트 환경측정시스템 안내 (PPT)
                    </FileContainer>
                </a>
                <a href="https://drive.google.com/file/d/1N3rtyQ5jXNeHJnfHZZrfCpgQog0fm7WH/view">
                    <FileContainer>
                        <MdFileDownload size="20" /> 스마트 환경 측정기기 매뉴얼 (영상자료 QR 코드)
                    </FileContainer>
                </a>
            </div>

        </div>
    )
}