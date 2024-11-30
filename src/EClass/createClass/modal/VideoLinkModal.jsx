import React, { useState } from 'react';
import Modal from 'react-modal';

// Modal의 접근성 설정 (root element 지정)
Modal.setAppElement('#root');

function VideoLinkModal({
  isOpen,
  setIsOpen,
  videoLink,
  setVideoLink,
  handleClose,
}) {
  // 영상 링크 입력 핸들러
  const handleChange = (event) => {
    setVideoLink(event.target.value);
  };

  // 제출 핸들러
  const handleSubmit = (event) => {
    event.preventDefault(); // 기본 폼 제출 방지
    setVideoLink(''); // 입력 필드 초기화
    setIsOpen(false);
    handleClose();
  };

  const handleCancel = () => {
    setVideoLink('');
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="Video Link Modal"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          borderRadius: '8px',
          width: '400px',
          border: '1px solid #ccc',
          backgroundColor: '#fff',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <h2
        style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}
      >
        영상 링크 입력
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="YouTube 링크를 입력하세요"
          value={videoLink}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
          required
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              padding: '8px 16px',
              marginRight: '8px',
              backgroundColor: '#e0e0e0',
              color: '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            취소
          </button>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            확인
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default VideoLinkModal;
