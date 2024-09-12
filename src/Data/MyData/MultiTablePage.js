import React from "react";
import {
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const createData = (name, value) => {
  return { name, value };
};

const rows = [
  createData("2024-07-08", "Data 1"),
  createData("2024-07-08", "Data 2"),
  createData("2024-07-08", "Data 3"),
];

const MultiTablePage = () => {
  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: "3vh" }}>
        My Data 메인 페이지
      </Typography>
      <Grid container spacing={3}>
        {[...Array(4)].map((_, index) => (
          <Grid item xs={12} md={6} key={index}>
            {index == 0 && (
              <Typography variant="h5" sx={{ marginBottom: "2vh" }}>
                최근 측정 데이터
              </Typography>
            )}
            {index == 1 && (
              <Typography variant="h5" sx={{ marginBottom: "2vh" }}>
                최근 수업 자료
              </Typography>
            )}
            {index == 2 && (
              <Typography variant="h5" sx={{ marginBottom: "2vh" }}>
                최근 제출된 과제
              </Typography>
            )}
            {index == 3 && (
              <Typography variant="h5" sx={{ marginBottom: "2vh" }}>
                최근 진행한 수업
              </Typography>
            )}
            <Paper sx={{ marginBottom: "20px" }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>저장 일시</TableCell>
                      <TableCell>이름</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell>{row.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MultiTablePage;
