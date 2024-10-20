import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import MyDataList from './MyDataList';
import { Typography } from '@mui/material';

// DATA 드롭다운
export default function MyDataDropdown({
  filteredData,
  setFilteredData,
  summary,
  setSummary,
}) {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const handleClick = () => {
    setIsOpenDropdown(true);
  };
  const handleClose = () => {
    setIsOpenDropdown(false);
  };

  return (
    <div>
      <Button
        id="fade-button"
        onClick={isOpenDropdown ? handleClose : handleClick}
      >
        <Typography
          sx={{
            fontSize: '3vh',
            color: 'black',
          }}
        >
          My Data
        </Typography>
      </Button>

      {/* DATA 드롭다운 리스트 */}
      {isOpenDropdown && (
        <MyDataList
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          summary={summary}
          setSummary={setSummary}
        />
      )}
    </div>
  );
}
