import './Training.scss';
import styled from 'styled-components';
import { LuSprout } from "react-icons/lu";
import { FaYoutube } from "react-icons/fa";

const FileContainer = styled.div`
    text-align: left;
    padding: 0.2rem 0.5rem;
    font-size: 0.9em;
    background: #f2f2f2;
    width: 35rem;
    border-radius: 0.3125rem;
    margin-top: 0.5rem;
`

export default function Training2() {
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
                <span style={{ fontWeight: 'bold' }}>환경교육의 현황</span>
                <a href="https://www.youtube.com/watch?v=kmvjNk1zOBg">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 환경교육과정의 이해
                    </FileContainer>
                </a>
                <a href="https://www.youtube.com/watch?v=lbj_OrEYrVI">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 환경교육의 필요성
                    </FileContainer>
                </a>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <span style={{ fontWeight: 'bold' }}>환경교육과 첨단시스템의 활용</span>
                <a href="https://www.youtube.com/watch?v=phMICePzeWs">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 스마트 환경측정 디바이스 소개
                    </FileContainer>
                </a>
                <a href="https://www.youtube.com/watch?v=SIwjP9omsOU">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 스마트 환경측정 디바이스 사용 방법
                    </FileContainer>
                </a>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <span style={{ fontWeight: 'bold' }}>스마트 디바이스의 교육적 활용을 위한 환경교육 프로그램 안내 영상(유치원)</span>
                <a href="https://www.youtube.com/watch?v=ukRpda91z9g">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 수권 교수학습자료
                    </FileContainer>
                </a>
                <a href="https://www.youtube.com/watch?v=ib5npuyKeEg">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 기권 교수학습자료
                    </FileContainer>
                </a>
                <a href="https://www.youtube.com/watch?v=AlYR3-ZR39w">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 생태계 교수학습자료
                    </FileContainer>
                </a>
                <a href="https://www.youtube.com/watch?v=hQs6hH9Jyfg">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 지권 교수학습자료
                    </FileContainer>
                </a>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <span style={{ fontWeight: 'bold' }}>스마트 디바이스의 교육적 활용을 위한 환경교육 프로그램 안내 영상(초등)</span>
                <a href="https://www.youtube.com/watch?v=Gi3oq1ZXs78">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 수권 교수학습자료
                    </FileContainer>
                </a>
                <a href="https://www.youtube.com/watch?v=GBe9IHCfkaU">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 기권 교수학습자료
                    </FileContainer>
                </a>
                <a href="https://www.youtube.com/watch?v=3As4OMWQIOw">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 생태계 교수학습자료
                    </FileContainer>
                </a>
                <a href="https://www.youtube.com/watch?v=TezIlFHmd8k">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 지권 교수학습자료
                    </FileContainer>
                </a>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <span style={{ fontWeight: 'bold' }}>스마트 디바이스의 교육적 활용을 위한 환경교육 프로그램 안내 영상(중등)</span>
                <a href="https://www.youtube.com/watch?v=MQHKGeBdslE">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 수권 교수학습자료
                    </FileContainer>
                </a>
                <a href="https://www.youtube.com/watch?v=DVCmu2-1vKo">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 기권 교수학습자료
                    </FileContainer>
                </a>
                <a href="https://www.youtube.com/watch?v=AzJyDaOlFM8">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 생태계 교수학습자료
                    </FileContainer>
                </a>
                <a href="https://www.youtube.com/watch?v=p5u7al8z7a0">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 지권 교수학습자료
                    </FileContainer>
                </a>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <span style={{ fontWeight: 'bold' }}>환경 융합 교수-학습전략 (공학설계, MEA와 SSI)</span>
                <a href="https://www.youtube.com/watch?v=P9-LEGtCi1s">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 환경 융합교육 - 공학설계
                    </FileContainer>
                </a>
                <a href="https://www.youtube.com/watch?v=Nub6Dp3h8LU">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 환경 융합교육 - MEA SSI
                    </FileContainer>
                </a>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <span style={{ fontWeight: 'bold' }}>스마트 환경측정기기 적용 실험</span>
                <a href="https://www.youtube.com/watch?v=3FFjUFIPL-I">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 기권 실험
                    </FileContainer>
                </a>
                <a href="https://www.youtube.com/watch?v=MpPeXvPYDmk">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 생태계 실험(식물-기권)
                    </FileContainer>
                </a>
                <a href="https://www.youtube.com/watch?v=9C2UDvMkth4">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 생태계 실험(생물-수권)
                    </FileContainer>
                </a>
                <a href="https://www.youtube.com/watch?v=CxGX9qPNF8A">
                    <FileContainer>
                        <FaYoutube size="20" color="red" /> 지권 실험
                    </FileContainer>
                </a>
            </div>

        </div>
    )
}