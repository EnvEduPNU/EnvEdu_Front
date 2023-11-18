import React, { useState, useEffect } from 'react';
import { customAxios } from '../Common/CustomAxios';

const Folder = ({ folder, onSelectFolder, selectedFolderId, onClicked }) => {
    //const [isExpanded, setIsExpanded] = useState(false);
    const toggleFolder = () => {
        //setIsExpanded(!isExpanded);
        onSelectFolder(folder.id);
    };

    const isSelected = onClicked.includes(folder.id);
    const folderStyle = {
        background: isSelected ? '#d2d2d2' : '#fff'
    };

    return (
        <div>
            <div onClick={toggleFolder} style={folderStyle}>
                {/*{isExpanded ? '-' : '+'}*/}
                <img src="/assets/img/folder-icon.png" style={{ width: '1.5rem', margin: '0.5rem' }} />
                <span>{folder.folderName}</span>
            </div>
            {/* {isExpanded && folder.child.length > 0 && ( */}
            {folder.child.length > 0 && (
                <div style={{ marginLeft: '2rem' }}>
                    {folder.child.map((subfolder) => (
                        <Folder 
                            key={subfolder.id} 
                            folder={subfolder} 
                            onSelectFolder={onSelectFolder}
                            selectedFolderId={selectedFolderId} 
                            onClicked={onClicked}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const FolderStructure = ({ data, selectedFolderId, onSelectFolder, onClicked }) => {
    return (
        <div>
            {data.map((folder) => (
                <Folder 
                    key={folder.id} 
                    folder={folder} 
                    onSelectFolder={onSelectFolder}
                    selectedFolderId={selectedFolderId} 
                    onClicked={onClicked}
                />
            ))}
        </div>
    );
};

export default function FolderListForDelete({ onSelectFolder, onClicked }) {
    const [data, setData] = useState([]);
    useEffect(() => {
        customAxios.get('/datafolder/list')
            .then((res) => setData(res.data))
            .catch((err) => console.log(err));
    }, []);

    return (
        <>
            <FolderStructure 
                data={data} 
                onSelectFolder={onSelectFolder}
                onClicked={onClicked}
            />
        </>
    );
}
