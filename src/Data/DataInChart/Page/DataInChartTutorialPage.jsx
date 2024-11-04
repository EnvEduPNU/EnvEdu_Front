import React from 'react';

function DataInChartTutorialPage() {
  const videos = [
    {
      title: 'Intro to Data & Chart',
      url: 'https://www.youtube.com/embed/UQ7It9e3jxY?si=FQ14OrkEMRzSjDaI',
      navigateUrl:
        'https://www.youtube.com/embed/UQ7It9e3jxY?si=FQ14OrkEMRzSjDaI',
      desc: '설명입니다. 설명입니다',
      color: '#AED581',
    },
    {
      title: 'How to Select Data',
      url: 'https://www.youtube.com/embed/UQ7It9e3jxY?si=FQ14OrkEMRzSjDaI',
      navigateUrl:
        'https://www.youtube.com/embed/UQ7It9e3jxY?si=FQ14OrkEMRzSjDaI',
      desc: '설명입니다. 설명입니다',
      color: '#FFAB91',
    },
    {
      title: 'Chart Customization Guide Guide Guide Guide Guide',
      url: 'https://www.youtube.com/embed/UQ7It9e3jxY?si=FQ14OrkEMRzSjDaI',
      navigateUrl:
        'https://www.youtube.com/embed/UQ7It9e3jxY?si=FQ14OrkEMRzSjDaI',
      desc: '설명입니다. 설명입니다',
      color: '#CE93D8',
    },
    // 추가적으로 더 많은 영상을 넣을 수 있습니다.
  ];

  return (
    <div
      style={{
        padding: '20px',
        minHeight: '100vh',
      }}
    >
      <h1
        style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}
      >
        Data & Chart 튜토리얼
      </h1>
      <h3
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#757575',
        }}
      >
        Data & Chart 페이지에 있는 기능들을 어떻게 사용하는지 동영상으로 학습할
        수 있는 페이지입니다.
      </h3>
      <div
        style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'left',
        }}
      >
        {videos.map((video, index) => (
          <div
            key={index}
            style={{
              backgroundColor: video.color,
              width: '300px', // 카드의 너비를 300px로 확장
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <div
              style={{ padding: '20px', fontSize: '50px', color: '#FFFFFF' }}
            >
              🎥
            </div>
            <iframe
              width="100%"
              height="180" // iframe의 높이를 조정하여 비율 유지
              src={video.url}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ display: 'block' }}
            ></iframe>
            <div style={{ padding: '10px', backgroundColor: '#FFFFFF' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600' }}>
                {video.title}
              </h2>
              <p
                style={{ fontSize: '14px', color: '#757575', margin: '5px 0' }}
              >
                {video.desc}
              </p>
              <button
                onClick={() => {
                  window.location.href = video.navigateUrl;
                }}
                style={{
                  backgroundColor: '#BBDEFB',
                  color: '#1E88E5',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  border: 'none',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
              >
                Watch Now
              </button>
            </div>
            <div
              style={{
                backgroundColor: video.color,
                borderBottomLeftRadius: '10px',
                borderBottomRightRadius: '10px',
                height: '20px',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DataInChartTutorialPage;
