import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function GraphOpinionText() {
  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      sx={{ margin: "0", padding: "0" }}
    >
      <div>
        <TextField
          id="outlined-multiline-static"
          label="Multiline"
          multiline
          rows={4}
          defaultValue="Default Value"
          sx={{ width: "110%" }}
        />
      </div>
    </Box>
  );
}
