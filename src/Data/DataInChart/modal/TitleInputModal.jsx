import React from 'react';
import ReactModal from 'react-modal';
import { useGraphDataStore } from '../store/graphStore';
import { saveCustomTableApi } from '../../apis/tables';
import { customAxios } from '../../../Common/CustomAxios';

const customModalStyles = {
  content: {
    width: '400px',
    height: '200px',
    margin: 'auto',
    borderRadius: '8px',
    border: '1px solid #ccc',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

function TitleInputModal({ isOpen, setIsOpen, title, setTitle, setSummary }) {
  const { data, variables } = useGraphDataStore();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleSaveModal = async () => {
    setIsOpen(false);

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
        title,
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
            title: data.title,
          }));

          setSummary((prev) => [...prev, formattedData]);
        })
        .catch((err) => console.log(err));

      await customAxios
        .get(`/api/custom/list?username=${localStorage.getItem('username')}`)
        .then((res) => {
          console.log(res.data);
          const formattedData = res.data.map((table) => ({
            saveDate: table.saveDate.split('T')[0],
            dataLabel: 'CUSTOM',
            dataUUID: table.dataUUID,
            memo: table.memo,
            title: table.title,
          }));
          setSummary((prev) => [...prev, ...formattedData]);
        });

      setTitle('');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      style={customModalStyles}
      onRequestClose={handleCloseModal}
    >
      <h2 style={{ marginBottom: '16px' }}>테이블 제목을 입력해주세요.</h2>
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Enter your title"
        style={{
          padding: '8px',
          width: '100%',
          marginBottom: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '16px',
        }}
      />
      <div style={{ display: 'flex', gap: '20px' }}>
        <button
          onClick={handleSaveModal}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Save
        </button>
        <button
          onClick={handleCloseModal}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336', // 취소 버튼 배경색 (빨간색)
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </ReactModal>
  );
}

export default TitleInputModal;
