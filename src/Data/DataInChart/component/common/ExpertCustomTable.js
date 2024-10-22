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
        <table
          style={{
            width: '100%',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'rgba(34, 36, 38, 0.15)',
            borderRadius: '12px',
            captionSide: 'top',
            borderCollapse: 'collapse',
          }}
        >
          <caption
            style={{
              fontSize: '2rem',
              fontWeight: '600',
              padding: '0.5rem',
              textAlign: 'center',
              color: 'black',
            }}
          >
            {title}

            <button
              onClick={handleEdit}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '16px',
                marginLeft: '1rem',
                backgroundColor: '#4a4a4a',
                color: 'white',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#3b3b3b')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#4a4a4a')}
            >
              수정하기
            </button>

            <button
              onClick={saveCustomTable}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '16px',
                marginLeft: '1rem',
                backgroundColor: '#4a4a4a',
                color: 'white',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#3b3b3b')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#4a4a4a')}
            >
              저장하기
            </button>
          </caption>
          <thead>
            <tr>
              {['', ...headers].map((header, headerIndex) => (
                <th
                  key={headerIndex}
                  style={{
                    border: '1px solid rgba(34, 36, 38, 0.15)',
                    boxShadow: '0 8px 5px -5px rgba(0,0,0,0.3)',
                    zIndex: 30,
                    padding: '0.75rem 0.5rem',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{header}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {[rowIndex, ...row].map((value, valueIndex) => (
                  <td
                    key={valueIndex}
                    style={{
                      border: '1px solid rgba(34, 36, 38, 0.15)',
                      textAlign: 'center',
                      padding: '0.5rem',
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>{value}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  return (
    <div>
      <table
        style={{
          width: '100%',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderColor: 'rgba(34, 36, 38, 0.15)',
          borderRadius: '12px',
          captionSide: 'top',
          borderCollapse: 'collapse',
        }}
      >
        <caption
          style={{
            fontSize: '2rem',
            fontWeight: '600',
            padding: '0.5rem',
            textAlign: 'center',
            color: 'black',
          }}
        >
          {title}
          <button
            onClick={handleEditComplete}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '16px',
              marginLeft: '1rem',
              backgroundColor: '#4a4a4a',
              color: 'white',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              border: 'none',
              outline: 'none',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#3b3b3b')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#4a4a4a')}
          >
            완료
          </button>
          <button
            onClick={handleEditCancel}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '16px',
              marginLeft: '1rem',
              backgroundColor: '#4a4a4a',
              color: 'white',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              border: 'none',
              outline: 'none',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#3b3b3b')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#4a4a4a')}
          >
            취소
          </button>
        </caption>
        <thead>
          <tr>
            {['', ...modeificationHeaders].map((header, headerIndex) => (
              <th
                key={headerIndex}
                style={{
                  border: '1px solid rgba(34, 36, 38, 0.15)',
                  boxShadow: '0 8px 5px -5px rgba(0,0,0,0.3)',
                  zIndex: 30,
                  padding: '0.75rem 0.5rem',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{header}</span>

                  <button
                    onClick={() => handleDeleteColumn(headerIndex)}
                    style={{
                      marginLeft: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      color: '#4a4a4a',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      border: 'none',
                      outline: 'none',
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = '#e0e0e0')
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = '#f5f5f5')
                    }
                  >
                    <AiOutlineDelete size={16} />
                  </button>
                </div>

                <button
                  onClick={() => handleMoveColumnLeft(headerIndex)}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.875rem',
                    color: '#4a4a4a',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    border: 'none',
                    outline: 'none',
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = '#e0e0e0')
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = '#f5f5f5')
                  }
                >
                  ◀
                </button>

                <button
                  onClick={() => handleMoveColumnRight(headerIndex)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.875rem',
                    color: '#4a4a4a',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    border: 'none',
                    outline: 'none',
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = '#e0e0e0')
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = '#f5f5f5')
                  }
                >
                  ▶
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {modificationData.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {[rowIndex, ...row].map((value, valueIndex) => (
                <td
                  key={valueIndex}
                  style={{
                    border: '1px solid rgba(34, 36, 38, 0.15)',
                    textAlign: 'center',
                    padding: '0.5rem',
                  }}
                >
                  {valueIndex === 0 ? (
                    <span style={{ fontSize: '1rem' }}>{value}</span>
                  ) : (
                    <input
                      type="text"
                      value={value}
                      placeholder="Enter text"
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
                      style={{
                        fontSize: '1rem',
                        textAlign: 'center',
                        border: '1px solid transparent',
                        borderRadius: '0.375rem',
                        padding: '0.25rem',
                        backgroundColor: '#f9f9f9',
                        boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
                        width: 'auto',
                      }}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpertCustomTable;
