import * as React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import MyDataList from "./MyDataList";
import { Typography } from "@mui/material";

export default function MyDataButton(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    console.log("열림");
    setAnchorEl(event.currentTarget);

    props.setButtonCheck("MyData");
  };
  const handleClose = () => {
    console.log("닫힘");
    setAnchorEl(null);
  };

  useEffect(() => {}, [anchorEl]);

  return (
    <div>
      <Button id="fade-button" onClick={open ? handleClose : handleClick}>
        <Typography
          sx={{
            fontSize: "3vh",
            color: "black",
          }}
        >
          {props.buttonName}
        </Typography>
      </Button>

      {open && <MyDataList />}
    </div>
  );
}
