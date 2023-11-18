import Modal from 'react-modal';
import { customAxios } from '../../Common/CustomAxios';
import { useState, useEffect } from 'react';
import FolderList from '../folderList';
import './modal.scss';



export default function MoveFolderModal() {
    const [folderData, setFolderData] = useState([]);

    useEffect(() => {
        customAxios.get('/datafolder/list')
            .then((res) => setFolderData(res.data))
            .catch((err) => console.log(err));
    }, []);
    
    function extractFolderNames(folders) {
        let folderInfo = [];
        folders.forEach(folder => {
            folderInfo.push({ id: folder.id, name: folder.folderName });
            if (folder.child && folder.child.length > 0) {
                folderInfo = folderInfo.concat(extractFolderNames(folder.child));
            }
        });
        return folderInfo;
    }
    
    const folderNamesAndIds = extractFolderNames(folderData);

    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const handleFolderSelect = (folderId) => {
        setSelectedFolderId(folderId);
    };
    //console.log(selectedFolderId)
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const [parentId, setParentId] = useState(null);
    const [childId, setChildId] = useState(null);

    useEffect(() => {
        setChildId(selectedFolderId);
    }, [selectedFolderId])

    // 현재 선택한 폴더가 child 폴더라고 가정하고 어느 parent 폴더 아래에 위치시킬지 정함
    const moveFolder = () => {
        console.log(parentId)
        console.log(childId)
        if (parentId == null || childId == null) alert("폴더를 선택하세요.")
        else {
            customAxios.put('/datafolder/list', {
                parentId : parentId,
                childId : childId
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
                폴더 이동
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
                        <FolderList onSelectFolder={handleFolderSelect} onClicked={selectedFolderId} />
                    </div>

                    <span>
                        선택한 폴더를 
                        <select onChange={(e) => setParentId(e.target.value)}>
                            {folderNamesAndIds.map((folder, index) => (
                                <option key={index} value={folder.id}>{folder.name}</option>
                            ))}
                        </select>의 하위 폴더로 이동</span>

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