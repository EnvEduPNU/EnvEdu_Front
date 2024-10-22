import { useEffect, useState } from 'react';
import { useGraphDataStore } from '../../store/graphStore';
import { AiOutlineDelete } from 'react-icons/ai';
import { saveCustomTableApi } from '../../../apis/tables';
import { customAxios } from '../../../../Common/CustomAxios';

function ExpertCustomTable({ setSummary }) {
  const { data, title, setData, variables } = useGraphDataStore();
  const [isEditing, setIsEditing] = useState(false);

  const [modificationData, setModificationData] = useState([]);
  const [modeificationHeaders, setModeificationHeaders] = useState([]);

  useEffect(() => {
    setModificationData(data.map((value) => [...value]));
    setModeificationHeaders(data[0]);
  }, [data]);

  useEffect(() => {
    if (modificationData.length !== 0)
      setModeificationHeaders(modificationData[0]);
  }, [modificationData]);

  const headers = data[0];

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditComplete = () => {
    setData(modificationData, title + '수정본');
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    // 편집 데이터 초기화
    setModificationData(data.map((value) => [...value]));
  };

  const handleMoveColumnLeft = (headerIndex) => {
    if (headerIndex === 1) {
      alert('더 이상 이동할 수 없습니다.');
      return;
    }

    setModificationData((prev) => {
      // 각 행에서 headerIndex와 headerIndex-1의 열을 교환
      const updatedData = prev.map((row) => {
        const newRow = [...row];
        // headerIndex와 headerIndex-1의 값을 스왑
        [newRow[headerIndex - 2], newRow[headerIndex - 1]] = [
          newRow[headerIndex - 1],
          newRow[headerIndex - 2],
        ];
        return newRow;
      });
      return updatedData;
    });
  };

  const handleMoveColumnRight = (headerIndex) => {
    if (headerIndex === headers.length) {
      alert('더 이상 이동할 수 없습니다.');
      return;
    }

    setModificationData((prev) => {
      // 각 행에서 headerIndex와 headerIndex-1의 열을 교환
      const updatedData = prev.map((row) => {
        const newRow = [...row];
        // headerIndex와 headerIndex-1의 값을 스왑
        [newRow[headerIndex], newRow[headerIndex - 1]] = [
          newRow[headerIndex - 1],
          newRow[headerIndex],
        ];
        return newRow;
      });
      return updatedData;
    });
  };

  const handleDeleteColumn = (headerIndex) => {
    setModificationData((prev) => {
      // 각 행에서 headerIndex+1에 해당하는 열을 삭제
      const updatedData = prev.map((row) => {
        const newRow = [...row];
        newRow.splice(headerIndex - 1, 1); // headerIndex+1번째 열 삭제
        return newRow;
      });
      console.log(updatedData);
      return updatedData;
    });
  };

  const saveCustomTable = async () => {
    try {
      const date = new Date();
      console.log(data);
      console.log(variables);

      const stringFields = [];
      const numericFields = [];
      let order = 0;
      for (let i = 1; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
          const value = data[i][j];
          if (variables[j].type === 'Categorical') {
            stringFields.push({
              [variables[j].name]: {
                value,
                order,
              },
            });
          } else {
            numericFields.push({
              [variables[j].name]: {
                value,
                order,
              },
            });
          }
          order++;
        }
      }

      const payload = {
        dataUUID: crypto.randomUUID(),
        saveDate: new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString(),
        memo: '메모',
        dataLabel: 'CUSTOM',
        userName: localStorage.getItem('username'),
        numericFields,
        stringFields,
      };

      const response = await saveCustomTableApi(payload);

      await customAxios
        .get('/mydata/list')
        .then((res) => {
          console.log('My Data list : ' + JSON.stringify(res.data, null, 2));

          const formattedData = res.data.map((data) => ({
            ...data,
            saveDate: data.saveDate.split('T')[0],
            dataLabel:
              data.dataLabel === 'AIRQUALITY'
                ? '대기질 데이터'
                : data.dataLabel === 'OCEANQUALITY'
                ? '수질 데이터'
                : data.dataLabel,
          }));

          setSummary((prev) => [...prev, formattedData]);
        })
        .catch((err) => console.log(err));

      await customAxios.get('/api/custom/list').then((res) => {
        console.log(res.data);
        const formattedData = res.data.map((table) => ({
          saveDate: table.saveDate.split('T')[0],
          dataLabel: 'CUSTOM',
          dataUUID: table.dataUUID,
          memo: table.memo,
        }));
        setSummary((prev) => [...prev, ...formattedData]);
      });
    } catch (e) {
      console.log(e);
    }
  };
  if (!isEditing)
    return (
      <div>
        <table className="w-full border-solid border-[1px] border-[rgba(34, 36, 38, 0.15)] rounded-xl caption-top border-collapse">
          <caption className="text-2xl font-semibold py-2 text-center text-black">
            {title}

            <button
              className="px-2 py-1 text-md ml-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
              onClick={handleEdit}
              style={{ fontSize: '16px' }}
            >
              수정하기
            </button>

            <button
              className="px-2 py-1 text-md ml-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
              style={{ fontSize: '16px' }}
              onClick={saveCustomTable}
            >
              저장하기
            </button>
          </caption>
          <thead>
            <tr>
              {['', ...headers].map((header, headerIndex) => {
                return (
                  <th
                    className="border-[1px] border-[rgba(34, 36, 38, 0.15)]  shadow-[0_8px_5px_-5px_rgba(0,0,0,0.3)] z-30 leading-[20px] py-3 px-2 text-center"
                    key={headerIndex}
                  >
                    <span className="text-xl">{header}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, rowIndex) => (
              <tr>
                {[rowIndex, ...row].map((value, valueIndex) => {
                  return (
                    <td className="border-[1px] border-[rgba(34, 36, 38, 0.15)] text-center py-2">
                      <span className="text-md">{value}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  return (
    <div>
      <table className="w-full border-solid border-[1px] border-[rgba(34, 36, 38, 0.15)] rounded-xl caption-top border-collapse">
        <caption className="text-2xl font-semibold py-2 text-center text-black">
          {title}
          <button
            className="px-2 py-1 text-md ml-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
            onClick={handleEditComplete}
            style={{ fontSize: '16px' }}
          >
            완료
          </button>
          <button
            className="px-2 py-1 text-md ml-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
            onClick={handleEditCancel}
            style={{ fontSize: '16px' }}
          >
            취소
          </button>
        </caption>
        <thead>
          <tr>
            {['', ...modeificationHeaders].map((header, headerIndex) => {
              if (headerIndex === 0)
                return (
                  <th
                    className="border-[1px] border-[rgba(34, 36, 38, 0.15)]  shadow-[0_8px_5px_-5px_rgba(0,0,0,0.3)] z-30 leading-[20px] py-3 px-2 text-center"
                    key={headerIndex}
                  >
                    <span className="text-xl">{header}</span>
                  </th>
                );
              return (
                <th
                  className="relative border-[1px] border-[rgba(34, 36, 38, 0.15)]  shadow-[0_8px_5px_-5px_rgba(0,0,0,0.3)] z-30 leading-[20px] py-3 px-2 text-center"
                  key={headerIndex}
                >
                  {/* 제목 및 버튼 컨테이너 */}
                  <div className="inline-flex items-center space-x-2">
                    <span className="text-xl">{header}</span>

                    {/* 열 삭제 버튼 (휴지통 아이콘) */}
                    <button
                      className="ml-2 px-2 py-1 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      onClick={() => handleDeleteColumn(headerIndex)}
                    >
                      <AiOutlineDelete
                        size={16}
                        className="text-black font-bold"
                      />
                    </button>
                  </div>

                  {/* 왼쪽으로 열 이동 버튼 */}
                  <button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    onClick={() => handleMoveColumnLeft(headerIndex)}
                  >
                    ◀
                  </button>

                  {/* 오른쪽으로 열 이동 버튼 */}
                  <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 px-2 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    onClick={() => handleMoveColumnRight(headerIndex)}
                  >
                    ▶
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {modificationData.slice(1).map((row, rowIndex) => (
            <tr>
              {[rowIndex, ...row].map((value, valueIndex) => {
                if (valueIndex === 0)
                  return (
                    <td className="border-[1px] border-[rgba(34, 36, 38, 0.15)] text-center py-2">
                      <span className="text-md">{value}</span>
                    </td>
                  );
                return (
                  <td className="border-[1px] border-[rgba(34, 36, 38, 0.15)] text-center py-2">
                    <input
                      type="text"
                      className="text-md text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent bg-gray-50 shadow-sm placeholder-gray-400"
                      onChange={(e) => {
                        setModificationData((prev) => {
                          const copiedModificationData = prev.map((value) => [
                            ...value,
                          ]);

                          copiedModificationData[rowIndex + 1][valueIndex - 1] =
                            e.target.value;

                          return copiedModificationData;
                        });
                      }}
                      value={value}
                      placeholder="Enter text"
                      style={{ width: 'auto' }}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpertCustomTable;
