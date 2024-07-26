import React from "react";
import TeacherClassRoomTable from "../teacher/component/table/TeacherClassRoomTable";
import { Typography } from "@mui/material";
import TeacherStudentList from "../teacher/component/table/TeacherStudentList";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const drawerWidth = 240;

// 선생님 Classroom 선택 및 관리 페이지
export function TeacherClassroomPage() {
  return (
    <>
      {/* [왼쪽 블럭] 개인 정보 블럭 */}
      <Box
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {["All mail", "Trash", "Spam"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      {/* [가운데 블럭] 화면 공유 블럭 */}
      <div style={{ display: "inline-block", width: "100%", height: "100%" }}>
        <Typography variant="h4" sx={{ margin: "10px 0 10px 0" }}>
          {`[ E-Class ]`}
        </Typography>
        <div style={{ minHeight: "40rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: "80rem",
              minHeight: "40rem", // 부모 요소의 높이를 설정해야 전체 높이에 대해 중앙 정렬이 가능
              border: "1px solid grey",
            }}
          >
            <Typography>이곳에 E-Class 테이블 </Typography>
          </div>
        </div>
        <button
          //   onClick={}
          style={{ margin: "10px 0 ", width: "20%" }}
        >
          E-Class 생성
        </button>
        <button
          //   onClick={}
          style={{ margin: "10px 0 0 10px ", width: "20%" }}
        >
          공유 중지
        </button>
      </div>

      {/* [오른쪽 블럭] 수업 Step 테이블, 수업 상태 테이블 */}
      <div style={{ width: "25%", margin: "0 30px " }}>
        <TeacherStudentList />
        <button
          //   onClick={}
          style={{ margin: "10px 0 ", width: "50%" }}
        >
          학생추가
        </button>
        <TeacherClassRoomTable setCourseStep={3} />
        <button
          //   onClick={}
          style={{ margin: "10px 0 ", width: "50%" }}
        >
          ClassRoom 만들기
        </button>
      </div>
    </>
  );
}
