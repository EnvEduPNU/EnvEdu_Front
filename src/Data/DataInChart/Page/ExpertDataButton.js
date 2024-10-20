import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import ExpertDataList from './ExpertDataList';

export default function ExpertDataButton() {
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
          Example
        </Typography>
      </Button>

      {isOpenDropdown && <ExpertDataList />}
    </div>
  );
}
