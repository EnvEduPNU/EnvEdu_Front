import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";

export default function ProgressCircular() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "61vh",
        margin: "0 10px 10vh 0",
        border: "1px solid grey",
      }}
    >
      <CircularProgress />
      <Typography variant="h6">화면 공유를 중지하였습니다.</Typography>
      <Typography variant="h6">기다려주세요.</Typography>
    </div>
  );
}
