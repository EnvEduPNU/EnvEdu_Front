import React, { useEffect, useState } from 'react';
import { customAxios } from '../Common/CustomAxios';
import ContextMenu from './ContextMenu/ContextMenu';

const Folder = ({ folder, onSelectFolder, selectedFolderId }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

    const toggleFolder = () => {
        setIsExpanded(!isExpanded);
        onSelectFolder(folder.id);
    };

    const handleContextMenu = (event) => {
        event.preventDefault();
        //event.stopPropagation(); // 이벤트 버블링 차단

        setContextMenuVisible(true);
        setContextMenuPosition({ x: event.pageX, y: event.pageY });
    };

    const isSelected = folder.id === selectedFolderId;
    const folderStyle = {
        background: isSelected ? '#d2d2d2' : '#fff'
    };

    const handleWrapperContextMenu = (event) => {
        event.preventDefault(); // 최상위 div에서의 우클릭 기본 동작을 방지
    };

    return (
        <div onContextMenu={handleWrapperContextMenu}>
            <div onClick={toggleFolder} style={folderStyle}>
                {isExpanded ? '-' : '+'} 
                <img src="/assets/img/folder-icon.png" style={{ width: '1.5rem', margin: '0.5rem' }} />
                <span onContextMenu={handleContextMenu}>{folder.folderName}</span> 
            </div>
            {contextMenuVisible && 
                <ContextMenu
                    x={contextMenuPosition.x}
                    y={contextMenuPosition.y}
                    visible={contextMenuVisible}
                />
            }
            {isExpanded && folder.child.length > 0 && (
                <div style={{ marginLeft: '2rem' }}>
                    {folder.child.map((subfolder) => (
                        <Folder 
                            key={subfolder.id} 
                            folder={subfolder} 
                            onSelectFolder={onSelectFolder}
                            selectedFolderId={selectedFolderId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


const FolderStructure = ({ data, selectedFolderId, onSelectFolder }) => {
    return (
        <div>
            {data.map((folder) => (
                <Folder 
                    key={folder.id} 
                    folder={folder} 
                    onSelectFolder={onSelectFolder}
                    selectedFolderId={selectedFolderId} // 이 부분을 추가합니다
                />
            ))}
        </div>
    );
};

export default function FolderList({ onSelectFolder }) {
    const [data, setData] = useState([]);
    useEffect(() => {
        customAxios.get('/datafolder/list')
            .then((res) => {console.log(res.data); setData(res.data);})
            .catch((err) => console.log(err));
    }, [])

    return (
        <>
            <FolderStructure
                data={data}
                onSelectFolder={onSelectFolder}
            />
        </>
    );
}
