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
        top: '30%',
        left: '-13rem',
        transform: 'rotate(90deg)',
        transformOrigin: 'center',
        padding: '5px',
        borderRadius: '12px',
        backgroundColor: '#f9fafb',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {/* Table 탭 */}
        <div
          onClick={() => onClickTab('table')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '8px 100px',
            cursor: 'pointer',
            backgroundColor: tab === 'table' ? '#e0e7ff' : '#f3f4f6',
            borderRadius: '12px',
            border: `1px solid ${tab === 'table' ? '#b0bec5' : '#ccc'}`,
            boxShadow:
              tab === 'table'
                ? '0px 6px 10px rgba(0, 0, 0, 0.15)'
                : '0px 2px 4px rgba(0, 0, 0, 0.05)',
            transition:
              'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              tab === 'table' ? '#d1e7ff' : '#e5e7eb';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              tab === 'table' ? '#e0e7ff' : '#f3f4f6';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span
            style={{
              margin: '4px 0',
              color: '#333',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Table
          </span>
        </div>

        {/* Graph 탭 */}
        <div
          onClick={() => onClickTab('graph')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '8px 100px',
            cursor: 'pointer',
            backgroundColor: tab === 'graph' ? '#e0e7ff' : '#f3f4f6',
            borderRadius: '12px',
            border: `1px solid ${tab === 'graph' ? '#b0bec5' : '#ccc'}`,
            boxShadow:
              tab === 'graph'
                ? '0px 6px 10px rgba(0, 0, 0, 0.15)'
                : '0px 2px 4px rgba(0, 0, 0, 0.05)',
            transition:
              'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              tab === 'graph' ? '#d1e7ff' : '#e5e7eb';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              tab === 'graph' ? '#e0e7ff' : '#f3f4f6';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span
            style={{
              margin: '4px 0',
              color: '#333',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Graph
          </span>
        </div>
      </div>
    </div>
  );
}

export default Tab;
