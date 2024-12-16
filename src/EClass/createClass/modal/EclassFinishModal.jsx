import React, { useState } from 'react';
import Modal from 'react-modal';

// Modal의 접근성 설정 (root element 지정)
Modal.setAppElement('#root');

function EclassFinishModal({ isOpen, setIsOpen, handleClose, handleMove }) {
  const handleCloseModal = () => {
    setIsOpen(false);
    handleClose(); // 추가적으로 부모 컴포넌트의 handleClose 호출 (선택사항)
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel="수업 완료 모달"
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
        style={{
          textAlign: 'center',
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
        }}
      >
        수업 생성 완료
      </h2>

      <div style={{ marginBottom: '1.5rem' }}>
        수업이 생성되었습니다. E-Class 메인 페이지에서 수업 자료를 찾아 수업을
        실행시켜 수업을 시작하실 수 있습니다.
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button
          onClick={handleCloseModal}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#007BFF')}
        >
          확인
        </button>

        <button
          onClick={handleMove}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#218838')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#28a745')}
        >
          수업 실행으로 넘어가기
        </button>
      </div>
    </Modal>
  );
}

export default EclassFinishModal;
