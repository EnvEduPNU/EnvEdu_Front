import SplitLayout from "./SplitLayout";
import './What.scss';
import card1Img from './Image/card1.jpg';
import card2Img from './Image/card2.jpg';
import card3Img from './Image/card3.jpg';

export default function What() {
  return(
    <div className="what-we-do">
      <SplitLayout
        title={
          <>
            사용자 친화적인(user-friendly)
            <br />
            스마트 환경모니터링 킷(SEM Kit) 개발
          </>
        }
        description='SEM-kit 1.0와 연동하는 스마트디바이스 어플리케이션을 SEM-kit 2.0에서 구동하는 웹 서버와 스마트디바이스에서 구동하는 웹 어플리케이션을 개발함으로써 다음 그림과 같이 접근 가능한 스마트디바이스의 종류가 무선통신(예, 무선랜, 블루투스)이 가능한 스마트디바이스로 대폭 확장된다.'
        hashtags="# 이산화탄소 센서의 보정기능 추가 # 장비 및 센서의 온오프 점검기능"
        imageSrc={card1Img}
      />

      <SplitLayout
        title={
          <>
            스마트 환경교육 프로그램 자료와 
            <br />
            온라인 코스웨어 개발
          </>
        }
        description='설명'
        hashtags="# 환경지식 역량 # 시스템 사고역량 # 융합적 문제해결역량"
        imageSrc={card2Img}
      />

      <SplitLayout
        title={
          <>
            스마트 환경교육 효과 검증도구 
            <br />
            개발 및 대상자별 적용
          </>
        }
        description={
          <>
            스마트 환경 교육 효과 평가 도구 개발 및 타당도 신뢰도 검증
            <br />
            스마트 환경교육 프로그램 대상자별 적용 및 효과 검증 : 환경적 핵심역량에 근거한 신뢰롭고 타당한 평가 도구 보급
            <br />
            시민지도사 및 환경 교사 재교육 프로그램 확산 방안: 교육 및 지도사 양성을 통한 스마트 환경 교육의 신속한 학교 현장화
          </>
        }
        hashtags=""
        imageSrc={card3Img}
      />
    </div>
  )
}