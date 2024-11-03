import { Typography } from '@mui/material';
import './leftSlidePage.scss';
import ExpertDataList from './ExpertDataList';
import MyDataList from './MyDataList';

export default function LeftSlidePage({
  setDataCategory,
  summary,
  setSummary,
}) {
  return (
    <div style={{ margin: '0 5rem 8rem 3rem' }}>
      <div>
        <Typography
          sx={{
            fontSize: '3vh',
            color: 'black',
          }}
        >
          Example
        </Typography>

        <ExpertDataList setDataCategory={setDataCategory} />
      </div>
      <Typography
        sx={{
          fontSize: '3vh',
          color: 'black',
        }}
      >
        My Data
      </Typography>
      <MyDataList summary={summary} setSummary={setSummary} />
    </div>
  );
}
