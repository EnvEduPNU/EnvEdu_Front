import * as React from "react";
import Box from "@mui/material/Box";
import GraphOpinionText from "./GraphOpinionText";
import { Typography } from "@mui/material";
import PartSaveButton from "./PartSaveButton";
import ReportSaveButton from "./ReportSaveButton";

export default function GraphOpinionTempate() {
  return (
    <Box
      component="section"
      sx={{
        border: "0px dashed grey",
        padding: "5px",
        width: "30%",
      }}
    >
      <Typography
        sx={{ fontSize: "2rem" }}
      >{`[ 배운 것을 써봅시다. ]`}</Typography>
      <Box
        component="section"
        sx={{
          border: "0px dashed grey",
          padding: "5px",
          margin: "3vh 0 3vh 0",
          width: "100%",
        }}
      >
        1. 그래프를 만들면서 깨닫게 된 점.
      </Box>
      <GraphOpinionText />

      <Box
        component="section"
        sx={{
          border: "0px dashed grey",
          padding: "5px",
          margin: "3vh 0 3vh 0",
          width: "100%",
        }}
      >
        2. 그래프를 만들면서 깨닫게 된 점.
      </Box>
      <GraphOpinionText />

      <div style={{ display: "flex", flexDirection: "row" }}>
        <PartSaveButton buttonName={"파트 1 저장하기"} />
        <ReportSaveButton buttonName={"보고서 쓰기"} />
      </div>
    </Box>
  );
}
