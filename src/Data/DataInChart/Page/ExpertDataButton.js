import * as React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import MyDataList from "./MyDataList";
import { Typography } from "@mui/material";
import ExpertDataList from "./ExpertDataList";

export default function ExpertDataButton(props) {
  const [isFinished, setIsFinished] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    console.log("열림");
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (isFinished) {
      console.log("ExpertData 불러오기 성공");
      props.setButtonCheck("ExpertData");
      setAnchorEl(null);
      setIsFinished(false);
    }
  }, [anchorEl, isFinished]);

  return (
    <div>
      <Button id="fade-button" onClick={handleClick}>
        <Typography
          sx={{
            fontSize: "3vh",
            color: "black",
          }}
        >
          {props.buttonName}
        </Typography>
      </Button>

      {open && <ExpertDataList open={open} setIsFinished={setIsFinished} />}
    </div>
  );
}
