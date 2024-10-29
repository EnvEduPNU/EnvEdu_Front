import * as Styled from './Styled';
import { ReactComponent as GraphIcon } from '../../images/GraphIcon.svg';
import { ReactComponent as TableIcon } from '../../images/TableIcon.svg';
import { useTabStore } from '../../store/tabStore';
import { useGraphDataStore } from '../../store/graphStore';
import { useEffect } from 'react';
import { Graph } from '../CustomChart/Styled';

function Tab() {
  const { tab, changeTab } = useTabStore();
  const { data } = useGraphDataStore();

  const onClickTab = (newTab) => {
    if (newTab === 'graph' && data.length <= 0) {
      alert('데이터를 선택 후 graph 탭을 이용해주세요.');
      return;
    }
    changeTab(newTab);
  };

  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column', // 수직 정렬
        alignItems: 'center', // 탭들이 가운데 정렬되도록 설정
        gap: '10px', // 각 탭 간의 간격
      }}
    >
      <div
        onClick={() => onClickTab('table')}
        $isSelect={tab === 'table'}
        style={{
          display: 'flex',
          flexDirection: 'column', // 아이콘과 텍스트를 수직으로 정렬
          alignItems: 'center', // 가운데 정렬
          padding: '5px 100px',
          cursor: 'pointer',
          backgroundColor: tab === 'table' ? '#e0e7ff' : '#f3f4f6', // 선택 시 배경색 변경
          borderRadius: '8px',
          boxShadow:
            tab === 'table' ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none', // 선택된 탭에 그림자 효과
          transition: 'background-color 0.3s ease', // 부드러운 배경색 전환
          transform: 'rotate(90deg)', // 90도 회전
          transformOrigin: 'center', // 회전 기준점 설정 (중심)
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor =
            tab === 'table' ? '#d1e7ff' : '#e5e7eb'; // hover 효과
          e.currentTarget.style.transform = 'rotate(90deg) scale(1.05)'; // hover 시 확대 효과
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor =
            tab === 'table' ? '#e0e7ff' : '#f3f4f6'; // 기본 색상으로 돌아감
          e.currentTarget.style.transform = 'rotate(90deg) scale(1)'; // 기본 크기로 돌아감
        }}
      >
        <span
          style={{
            marginTop: '8px',
            color: '#333',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Table
        </span>
      </div>

      <div
        onClick={() => onClickTab('graph')}
        $isSelect={tab === 'graph'}
        style={{
          display: 'flex',
          flexDirection: 'column', // 아이콘과 텍스트를 수직으로 정렬
          alignItems: 'center', // 가운데 정렬
          padding: '5px 100px',
          cursor: 'pointer',
          backgroundColor: tab === 'graph' ? '#e0e7ff' : '#f3f4f6', // 선택 시 배경색 변경
          borderRadius: '8px',
          boxShadow:
            tab === 'graph' ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none', // 선택된 탭에 그림자 효과
          transition: 'background-color 0.3s ease', // 부드러운 배경색 전환
          transform: 'rotate(90deg)', // 90도 회전
          transformOrigin: 'center', // 회전 기준점 설정 (중심)
          marginTop: '200px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor =
            tab === 'graph' ? '#d1e7ff' : '#e5e7eb'; // hover 효과
          e.currentTarget.style.transform = 'rotate(90deg) scale(1.05)'; // hover 시 확대 효과
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor =
            tab === 'graph' ? '#e0e7ff' : '#f3f4f6'; // 기본 색상으로 돌아감
          e.currentTarget.style.transform = 'rotate(90deg) scale(1)'; // 기본 크기로 돌아감
        }}
      >
        <span
          style={{
            marginTop: '8px',
            color: '#333',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Graph
        </span>
      </div>
    </div>
  );
}

export default Tab;
