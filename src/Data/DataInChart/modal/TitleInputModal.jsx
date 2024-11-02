import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { useGraphDataStore } from '../store/graphStore';
import { saveCustomTableApi } from '../../apis/tables';
import { customAxios } from '../../../Common/CustomAxios';
import { Box, TextField, Typography } from '@mui/material';
import { AiOutlineClose } from 'react-icons/ai';

const customModalStyles = {
  content: {
    width: '400px',
    height: '320px',
    margin: 'auto',
    borderRadius: '8px',
    border: 'none',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f0f2f5', // 밝은 회색 배경
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

function TitleInputModal({ isOpen, setIsOpen, title, setTitle, setSummary }) {
  const { data, variables } = useGraphDataStore();
  const [memo, setMemo] = useState('');

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
        memo: memo,
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
      setMemo('');
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
      <button
        onClick={handleCloseModal}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          color: '#555',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          borderRadius: '50%',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = '#e0e0e0')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = 'transparent')
        }
      >
        <AiOutlineClose />
      </button>

      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#333' }}
        >
          테이블 정보 입력
        </Typography>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          sx={{
            marginBottom: 2,
            backgroundColor: '#fff',
            borderRadius: 1,
            boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
          }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Memo"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          sx={{
            backgroundColor: '#fff',
            borderRadius: 1,
            boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
          }}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </Box>
      <button
        onClick={handleSaveModal}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = '#45a049')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = '#4CAF50')
        }
      >
        저장 하기
      </button>
    </ReactModal>
  );
}

export default TitleInputModal;
