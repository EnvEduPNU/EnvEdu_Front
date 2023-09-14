import React, { useState } from 'react';

const Folder = ({ folder }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleFolder = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div onDoubleClick={toggleFolder}>
        {isExpanded ? '-' : '+'} {folder.folderName} &gt;
        <img src="/assets/img/folder-icon.png" style={{width: '3rem'}}/>
      </div>
      {isExpanded && folder.child.length > 0 && (
        <div>
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

  return (
    <div>
      <h4>폴더 구조</h4>
      <FolderStructure data={data} />
    </div>
  );
};

export default Fold;
