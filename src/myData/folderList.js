import React, { useEffect, useState } from 'react';
import { customAxios } from '../Common/CustomAxios';

const Folder = ({ folder, onSelectFolder, selectedFolderId }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleFolder = () => {
        setIsExpanded(!isExpanded);
        onSelectFolder(folder.id);
    };

    const isSelected = folder.id === selectedFolderId;
    const folderStyle = {
        background: isSelected ? '#d2d2d2' : '#fff'
    };

    return (
        <div>
            <div onClick={toggleFolder} style={folderStyle}>
                {isExpanded ? '-' : '+'} 
                <img src="/assets/img/folder-icon.png" style={{ width: '1.5rem', margin: '0.5rem' }} />
                <span>{folder.folderName}</span>
            </div>
            {isExpanded && folder.child.length > 0 && (
                <div style={{ marginLeft: '2rem' }}>
                    {folder.child.map((subfolder) => (
                        <Folder 
                            key={subfolder.id} 
                            folder={subfolder} 
                            onSelectFolder={onSelectFolder}
                            selectedFolderId={selectedFolderId} // 이 부분을 추가합니다
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
            .then((res) => setData(res.data))
            .catch((err) => console.log(err));
    }, [data])

    return (
        <>
            <FolderStructure 
                data={data} 
                onSelectFolder={onSelectFolder}
            />
        </>
    );
}
