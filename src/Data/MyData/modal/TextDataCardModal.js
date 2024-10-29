import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';

const TextDataCardModal = ({ open, handleClose, card }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          maxHeight: '80vh', // 최대 높이 설정
          overflowY: 'auto', // 세로 스크롤 추가
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          {card.title}
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          {card.content}
        </Typography>
        <TableContainer
          component={Paper}
          sx={{ mt: 2, maxHeight: '60vh', overflowY: 'auto' }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {card.properties.map((property, index) => (
                  <TableCell key={index}>{property}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {card.data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.keys(row).map((key, colIndex) => (
                    <TableCell key={colIndex}>{row[key]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{ marginRight: 1 }}
          >
            데이터 추가
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            취소
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TextDataCardModal;
