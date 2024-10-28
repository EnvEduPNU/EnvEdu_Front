import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height: '70vh',
        backgroundColor: 'white',
        border: '2px solid #d3d3d3', // 옅은 회색 선
        borderRadius: '20px', // 모서리 둥글게
        padding: '20px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // 그림자 추가
      }}
    >
      <Typography variant="h2" align="center" gutterBottom>
        Data & Chart 메인 입니다.
      </Typography>

      <Typography variant="h6" align="center" gutterBottom>
        왼쪽 데이터 테이블에서 데이터를 선택해주세요.
      </Typography>

      {/* <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '30px',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/table')}
          sx={{
            marginRight: '20px',
            padding: '15px 30px',
            fontSize: '1.2rem',
            borderRadius: '10px',
            backgroundColor: '#6200ea',
            '&:hover': {
              backgroundColor: '#3700b3',
            },
          }}
        >
          Go to Tables
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/graph')}
          sx={{
            padding: '15px 30px',
            fontSize: '1.2rem',
            borderRadius: '10px',
            backgroundColor: '#03a9f4',
            '&:hover': {
              backgroundColor: '#0288d1',
            },
          }}
        >
          Go to Graphs
        </Button>
      </Box> */}
    </div>
  );
}

export default MainPage;
