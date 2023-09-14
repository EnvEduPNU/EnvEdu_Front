import React, { useState } from 'react';

const Folder = ({ folder }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  

  const toggleFolder = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div onDoubleClick={toggleFolder}>
        ㄴ
        <img src="/assets/img/folder-icon.png" style={{width: '2rem', margin: '1rem 0.5rem'}}/>
        {folder.folderName}
      </div>
      {isExpanded && folder.child.length > 0 && (
        <div style={{ marginLeft: '20px' }}>
          {folder.child.map((subfolder) => (
            <Folder key={subfolder.id} folder={subfolder} />
          ))}
        </div>
      )}
    </div>
  );
};

const FolderStructure = ({ data }) => {
  return (
    <div>
      {data.map((folder) => (
        <Folder key={folder.id} folder={folder} />
      ))}
    </div>
  );
};

const Fold = () => {
  // 주어진 JSON 데이터
  const data = [
    {
      "id": 1,
      "folderName": "dataFolder1",
      "parent": null,
      "createDate": null,
      "updateDate": null,
      "child": [
        {
          "id": 2,
          "folderName": "dataFolder2",
          "parent": null,
          "createDate": null,
          "updateDate": null,
          "child": [
            {
              "id": 3,
              "folderName": "dataFolder3",
              "parent": null,
              "createDate": null,
              "updateDate": null,
              "child": [
                {
                  "id": 4,
                  "folderName": "dataFolder4",
                  "parent": null,
                  "createDate": null,
                  "updateDate": null,
                  "child": []
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  const [fold, setFold] = useState('');

  return (
    <div style={{border: '1px solid #d2d2d2', padding: '1rem', width: '30%'}}>
        <h4>폴더 구조</h4>
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <button 
                onClick={() => prompt('폴더 이름을 입력하세요')}
                style={{background: '#d2d2d2', border: 'none', width: '10rem', borderRadius: '0.625rem'}}>폴더 생성하기</button>
        </div>
        

      <FolderStructure data={data} />
    </div>
  );
};

export default Fold;
