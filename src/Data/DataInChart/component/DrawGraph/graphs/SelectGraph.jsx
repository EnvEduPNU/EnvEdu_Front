import React from 'react';
import { AiOutlineArrowUp } from 'react-icons/ai';

function SelectGraph() {
  const graphs = [
    { name: 'Bar Graph', description: '데이터를 막대 형태로 시각화합니다.' },
    {
      name: 'Line Graph',
      description: '데이터 변화를 선으로 연결하여 보여줍니다.',
    },
    {
      name: 'Combo Graph',
      description: '막대와 선 그래프를 결합하여 표시합니다.',
    },
    {
      name: 'Doughnut Graph',
      description: '원형 도넛 형태로 데이터 비율을 나타냅니다.',
    },

    {
      name: 'Scatter Graph',
      description: '데이터 분포를 점으로 시각화합니다.',
    },
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '480px',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9fafb',
      }}
    >
      {/* 상단 안내 영역 */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <AiOutlineArrowUp
            style={{
              marginLeft: '30px',
              fontSize: '32px',
              color: '#6b7280' /* 회색 화살표 색상 */,
            }}
          />
          <p
            style={{
              marginLeft: '30px',
              marginTop: '12px',
              fontSize: '24px',
              color: '#374151' /* 짙은 회색 텍스트 */,
              fontWeight: 'bold',
            }}
          >
            그래프 유형을 선택해주세요
          </p>
        </div>
      </div>

      {/* 가로 및 세로 스크롤 영역 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* 가로 스크롤 가능한 카드 목록 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            gap: '16px',
            padding: '16px',
            overflowX: 'auto',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          {graphs.map((graph, index) => (
            <div
              key={index}
              style={{
                flex: '0 0 200px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                transition: 'transform 0.2s',
                height: '140px',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = 'scale(1.05)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = 'scale(1)')
              }
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                }}
              >
                {graph.name}
              </h3>
              <p
                style={{
                  marginTop: '8px',
                  fontSize: '14px',
                  color: '#6b7280',
                }}
              >
                {graph.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SelectGraph;
