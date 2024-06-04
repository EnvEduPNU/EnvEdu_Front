import React, { useEffect, useState, useRef } from "react";
import { customAxios } from "../../Common/CustomAxios";
import ContextMenu from "./ContextMenu/ContextMenu";

// MY Data 페이지의 데이터
const Folder = ({ folder, onSelectFolder, selectedFolderId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const folderRef = useRef(null);
  const [rightClicked, setRightClicked] = useState(null);

  const toggleFolder = () => {
    setIsExpanded(!isExpanded);
    onSelectFolder(folder.id);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    //console.log("우클릭", folder.id); // 우클릭된 폴더 정보 출력
    setRightClicked(folder.id);
    setContextMenuVisible(true);
    //setContextMenuPosition({ x: e.pageX, y: e.pageY });
    const folderRect = folderRef.current.getBoundingClientRect(); // 폴더 DOM 요소의 위치와 크기 정보를 가져옴
    setContextMenuPosition({
      x: folderRect.right, // 폴더의 오른쪽 끝을 기준으로 x 위치 설정
      y: folderRect.top, // 폴더의 상단을 기준으로 y 위치 설정
    });
  };

  const handleWrapperContextMenu = (event) => {
    event.preventDefault(); // 최상위 div에서의 우클릭 기본 동작을 방지
  };
  //console.log("rightClicked",rightClicked)

  return (
    <div ref={folderRef} onContextMenu={handleWrapperContextMenu}>
      <div onClick={toggleFolder}>
        {isExpanded ? "-" : "+"}
        <img
          src="/assets/img/folder-icon.png"
          style={{ width: "1.5rem", margin: "0.5rem" }}
        />
        <span onContextMenu={handleContextMenu}>{folder.folderName}</span>
      </div>
      {/* {contextMenuVisible &&  */}
      <ContextMenu
        x={contextMenuPosition.x}
        y={contextMenuPosition.y}
        visible={contextMenuVisible}
        folder={folder} // 현재 폴더 정보를 prop으로 전달
        onClose={() => setContextMenuVisible(false)} // ContextMenu를 닫는 함수 전달
        rightClicked={rightClicked}
      />
      {/* } */}
      {isExpanded && folder.child.length > 0 && (
        <div style={{ marginLeft: "2rem" }}>
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
    customAxios
      .get("/datafolder/list")
      .then((res) => {
        //console.log(res.data);
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <FolderStructure data={data} onSelectFolder={onSelectFolder} />
    </>
  );
}
