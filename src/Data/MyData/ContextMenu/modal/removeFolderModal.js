import Modal from 'react-modal';
import { customAxios } from '../../../../Common/CustomAxios';
import { useState } from 'react';
import FolderListForDelete from '../folderListForDelete';
import './modal.scss';

export default function RemoveFolderModal() {
    const [selectedFolderId, setSelectedFolderId] = useState([]);

    const handleFolderSelect = (folderId) => {
        setSelectedFolderId(prev => {
            if (prev.includes(folderId)) {
                return prev.filter(id => id !== folderId);
            }
            else {
                return [...prev, folderId];
            }
        });
    };

    //console.log(selectedFolderId)
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const moveFolder = () => {
        if (selectedFolderId == []) alert("삭제할 폴더를 선택하세요.")
        else {
            console.log(selectedFolderId)
            customAxios.delete('/datafolder/item/delete', {
                id: selectedFolderId
            })
            .then(() => setModalIsOpen(false))
            .catch((err) => console.log(err));
        }
    };

    return (
        <>
            <button 
                className='yellow-btn'
                onClick={openModal}> 
                폴더 삭제
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="mydata-custom-modal"
                overlayClassName="custom-modal-overlay"
            >
                <div className="modal-content">
                    <h5>폴더를 선택해주세요!</h5> 

                    <div style={{border: '1px solid #d2d2d2', width: '100%', margin: '1rem 0'}}>
                        <FolderListForDelete onSelectFolder={handleFolderSelect} onClicked={selectedFolderId} />
                    </div>

                    <div style={{display: 'flex', justifyContent: 'space-between', width: '45%'}}>
                        <button 
                            className="close-button" 
                            onClick={moveFolder}>
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