import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './ContextMenu.scss';
import AddFolderModal from '../modal/addFolderModal';
import MoveFolderModal from '../modal/moveFolderModal';
import RemoveFolderModal from '../modal/removeFolderModal';
import { customAxios } from '../../Common/CustomAxios';
import Modal from 'react-modal';
import FolderList from '../folderList';
import FolderListForDelete from '../folderListForDelete';

export default function ContextMenu() {
    const [visible, setVisible] = useState(false);
    const rootRef = useRef(null);

    const handleContextMenu = (event) => {
        event.preventDefault();
        setVisible(true);

        const clickX = event.clientX;
        const clickY = event.clientY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const rootW = rootRef.current.offsetWidth;
        const rootH = rootRef.current.offsetHeight;

        const right = (screenW - clickX) > rootW;
        const left = !right;
        const top = (screenH - clickY) > rootH;
        const bottom = !top;

        if (right) {
            rootRef.current.style.left = `${clickX + 5}px`;
        }

        if (left) {
            rootRef.current.style.left = `${clickX - rootW - 5}px`;
        }

        if (top) {
            rootRef.current.style.top = `${clickY + 5}px`;
        }

        if (bottom) {
            rootRef.current.style.top = `${clickY - rootH - 5}px`;
        }
    };

    const handleClick = (event) => {
        if (visible && rootRef.current && !rootRef.current.contains(event.target)) {
            setVisible(false);
        }
    };

    const handleScroll = () => {
        if (visible) {
            setVisible(false);
        }
    };

    //폴더 추가
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);

    const openAddModal = () => {
        setAddModalIsOpen(true);
    };

    const closeAddModal = () => {
        setAddModalIsOpen(false);
    };

    const [folderName, setFolderName] = useState(null);
    const addFolder = () => {
        if (folderName == null  || folderName == '') alert("폴더명을 입력하세요.")
        else {
            customAxios.post('/datafolder/list', { 
                folderName: folderName 
            })
            .then(() => setAddModalIsOpen(false))
            .catch((err) => console.log(err));
        }
    }

    //폴더 이동
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
    const [moveModalIsOpen, setMoveModalIsOpen] = useState(false);

    const openMoveModal = () => {
        setMoveModalIsOpen(true);
    };

    const closeMoveModal = () => {
        setMoveModalIsOpen(false);
    };

    const [parentId, setParentId] = useState(null);
    const [childId, setChildId] = useState(null);

    useEffect(() => {
        setChildId(selectedFolderId);
        console.log(selectedFolderId)
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
            .then(() => setMoveModalIsOpen(false))
            .catch((err) => console.log(err));
        }
    };

    //폴더 삭제
    const [selectedFolderId2, setSelectedFolderId2] = useState([]);

    const handleFolderSelect2 = (folderId) => {
        setSelectedFolderId2(folderId);
    };

    //console.log(selectedFolderId)
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const removeFolder = () => {
        if (selectedFolderId2 === null) alert("삭제할 폴더를 선택하세요.")
        else {
            console.log(selectedFolderId2)
            customAxios.delete(`/datafolder/list`, {
                parentId: selectedFolderId2
            })
            .then(() => setModalIsOpen(false))
            .catch((err) => console.log(err));
        }
    };

    useEffect(() => {
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('click', handleClick);
        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('click', handleClick);
            document.removeEventListener('scroll', handleScroll);
        };
    });

    return (
        <>
            {visible ? (
                <div ref={rootRef} className="contextMenu">
                    <div className="contextMenu--option" onClick={openAddModal}>폴더 추가</div>
                    <div className="contextMenu--option" onClick={openMoveModal}>폴더 이동</div>
                    <div className="contextMenu--option" onClick={openModal}>폴더 삭제</div>
                </div>
            ) : null}
            
            <Modal
                isOpen={addModalIsOpen}
                onRequestClose={closeAddModal}
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
                            onClick={closeAddModal}>
                            닫기
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={moveModalIsOpen}
                onRequestClose={closeMoveModal}
                className="mydata-custom-modal"
                overlayClassName="custom-modal-overlay"
            >
                <div className="modal-content">
                    <h5>폴더를 선택해 주세요!</h5> 

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
                            onClick={closeMoveModal}>
                            닫기
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="mydata-custom-modal"
                overlayClassName="custom-modal-overlay"
            >
                <div className="modal-content">
                    <h5>폴더를 선택해주세요!</h5> 

                    <div style={{border: '1px solid #d2d2d2', width: '100%', margin: '1rem 0'}}>
                        <FolderListForDelete onSelectFolder={handleFolderSelect2} onClicked={selectedFolderId2} />
                    </div>

                    <div style={{display: 'flex', justifyContent: 'space-between', width: '45%'}}>
                        <button 
                            className="close-button" 
                            onClick={removeFolder}>
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
    );
};

//ReactDOM.render(<ContextMenu />, document.getElementById('root'));
