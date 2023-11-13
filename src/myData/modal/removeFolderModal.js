import Modal from 'react-modal';
import { useState } from 'react';

export default function RemoveFolderModal() {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <>
            <button 
                className='yellow-btn'
                onClick={openModal}> 
                폴더 삭제
            </button>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                <h2>모달 제목</h2>
                <p>모달 내용</p>
                <button 
                    onClick={closeModal}
                    className='close-button'>닫기</button>
            </Modal>
        </>
    )
} 