import Modal from 'react-modal';
import { customAxios } from '../../Common/CustomAxios';
import { useState } from 'react';
import './modal.scss';

export default function AddFolderModal() {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const [folderName, setFolderName] = useState(null);
    const addFolder = () => {
        if (folderName == null  || folderName == '') alert("폴더명을 입력하세요.")
        else {
            customAxios.post('/datafolder/list', { 
                folderName: folderName 
            })
            .then(() => setModalIsOpen(false))
            .catch((err) => console.log(err));
        }
    }

    return (
        <>
            <button 
                className='yellow-btn'
                onClick={openModal}> 
                폴더 추가
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="mydata-custom-modal"
                overlayClassName="custom-modal-overlay"
            >
                <div className="modal-content">
                    <h5>폴더명을 입력해주세요!</h5>
                    <input onChange={(e) => setFolderName(e.target.value)}/>
                    
                    <div style={{display: 'flex', justifyContent: 'space-between', width: '45%'}}>
                        <button 
                            className="close-button" 
                            onClick={addFolder}>
                            확인
                        </button>

                        <button 
                            className="close-button" 
                            onClick={closeModal}>
                            닫기
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
} 