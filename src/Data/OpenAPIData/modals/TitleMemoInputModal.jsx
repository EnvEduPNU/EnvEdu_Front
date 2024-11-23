import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { Box, TextField, Typography } from '@mui/material';
import { AiOutlineClose } from 'react-icons/ai';
import { saveAirByCity, saveAirByPlace } from '../apis/air';
import { saveWaterByPlace } from '../apis/water';

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

function TitleMemoInputModal({
  type,
  isOpen,
  setIsOpen,
  dataList,
  filteredRows,
  filteredColumns,
  getRowDataToServer,
}) {
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleSaveModal = async () => {
    setIsOpen(false);

    try {
      let saveToDataList = dataList
        .map((datas, rowIndex) => {
          if (filteredRows[rowIndex] === true)
            return getRowDataToServer(datas).map((data, columnIndex) => {
              console.log(data);
              if (filteredColumns[columnIndex] === true)
                return {
                  [data.key]: data.value,
                };
              else
                return {
                  [data.key]: null,
                };
            });
          else return null;
        })
        .filter((value) => value !== null);
      console.log(saveToDataList);

      let realSaveToDataList = [];

      for (let i = 0; i < saveToDataList.length; i++) {
        const result = Object.assign(
          {},
          ...Object.values(
            saveToDataList[i].map((value) => {
              if (
                (Object.keys(value)[0] === 'ITEMNO2' ||
                  Object.keys(value)[0] === 'ITEMSO2VALUE' ||
                  Object.keys(value)[0] === 'ITEMO3') &&
                value[Object.keys(value)[0]] !== null
              )
                return {
                  [Object.keys(value)[0]]: `0${value[Object.keys(value)[0]]}`,
                };
              else return value;
            }),
          ),
        );
        realSaveToDataList.push(result);
      }
      console.log(realSaveToDataList);
      if (type === 'airCity') saveAirByCity(realSaveToDataList, memo, title);
      else if (type === 'airPlace')
        saveAirByPlace(realSaveToDataList, memo, title);
      else if (type === 'waterPlace')
        saveWaterByPlace(realSaveToDataList, memo, title);

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

export default TitleMemoInputModal;
