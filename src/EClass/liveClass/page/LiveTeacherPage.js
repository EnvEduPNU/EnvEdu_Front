import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { customAxios } from "../../../Common/CustomAxios";
import TeacherAssignmentTable from "../teacher/component/table/myDataPageTable/TeacherAssignmentTable";
import TeacherCourseStatusTable from "../teacher/component/table/myDataPageTable/TeacherCourseStatusTable";
import { TeacherStepShareButton } from "../teacher/component/button/TeacherStepShareButton";
import TeacherRenderAssign from "../teacher/component/TeacherRenderAssign";
import { TeacherScreenShare } from "../teacher/component/screenShare/TeacherScreenShare";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export const LiveTeacherPage = () => {
  const [sharedScreenState, setSharedScreenState] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [courseStep, setCourseStep] = useState();
  const [stepCount, setStepCount] = useState();
  const [sessionIds, setSessionIds] = useState([]);
  const [assginmentShareCheck, setAssginmentShareCheck] = useState(false);

  const { eClassUuid } = useParams();
  const location = useLocation();
  const { lectureDataUuid, eClassName } = location.state || {};

  const [studentState, setStudentState] = useState();

  let stompClients = null;

  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchSessionIds = async () => {
  //     const response = await customAxios.get("/api/sessions/get-session-ids");
  //     const sessionIds = response.data;
  //     setSessionIds(sessionIds);
  //     console.log("참여한 학생 : ", JSON.stringify(sessionIds, null, 2));
  //   };

  //   const delayFetch = setTimeout(() => {
  //     fetchSessionIds();
  //   }, 1000);

  //   return () => clearTimeout(delayFetch);
  // }, [studentState]);

  useEffect(() => {
    const fetchSessionIds = async () => {
      const response = await customAxios.get("/api/sessions/get-session-ids");
      const sessionIds = response.data;
      setSessionIds(sessionIds);
      console.log("참여한 학생 : ", JSON.stringify(sessionIds, null, 2));
    };
    fetchSessionIds();

    if (!stompClients) {
      const token = localStorage.getItem("access_token").replace("Bearer ", "");
      const sock = new SockJS(
        `${process.env.REACT_APP_API_URL}/ws?token=${token}`
      );
      stompClients = Stomp.over(sock);

      stompClients.connect(
        {},
        () => {
          stompClients.subscribe("/topic/student-entered", function (message) {
            const parsedMessage = JSON.parse(message.body);
            console.log(
              "학생 상태 : " + JSON.stringify(parsedMessage, null, 2)
            );
            // if (parsedMessage.entered === false) {
            // }

            // 1초 지연 후 fetchSessionIds 호출
            setTimeout(() => {
              fetchSessionIds();
            }, 1000);
          });
        },
        onError
      );
    }

    function onError(error) {
      console.error("STOMP 연결 에러:", error);
      alert(
        "웹소켓 연결에 실패했습니다. 네트워크 설정을 확인하거나 관리자에게 문의하세요."
      );
    }

    return () => {
      if (stompClients) {
        stompClients.disconnect(() => {
          console.log("STOMP 연결 해제");
        });
      }
    };
  }, []);

  const closeEclass = async () => {
    await customAxios
      .patch(`/api/eclass/eclass-close?uuid=${eClassUuid}`)
      .then((response) => {
        console.log("Eclass closed :", response.data);
        alert("수업을 종료하였습니다!");
        navigate("/");
      })
      .catch((error) => {
        console.error("Eclass 종료 에러:", error);
      });
  };

  function DefaultPageComponent() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "65vh",
          margin: "0 10px 0 0",
          border: "1px solid grey",
        }}
      >
        <Typography variant="h6">수업을 시작해주세요.</Typography>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", margin: "0 20vh" }}>
      {/* [왼쪽 블럭] 화면 공유 블럭 */}
      <div style={{ display: "inline-block", width: "100%", height: "100%" }}>
        <Typography variant="h4" sx={{ margin: "0 0 10px 0" }}>
          {eClassName}
        </Typography>
        {sharedScreenState ? (
          <TeacherScreenShare
            eClassUuid={eClassUuid}
            setSharedScreenState={setSharedScreenState}
            sharedScreenState={sharedScreenState}
            sessionIds={sessionIds}
          />
        ) : (
          <div>
            {stepCount ? (
              <>
                <TeacherRenderAssign data={tableData} />
              </>
            ) : (
              <DefaultPageComponent />
            )}
          </div>
        )}
        <TeacherStepShareButton
          stepCount={stepCount}
          lectureDataUuid={lectureDataUuid}
          sharedScreenState={sharedScreenState}
          setAssginmentShareCheck={setAssginmentShareCheck}
        />
        <button
          onClick={closeEclass}
          style={{
            margin: "10px 0 0 10px ",
            width: "18%",
            marginRight: 1,
            fontFamily: "'Asap', sans-serif",
            fontWeight: "600",
            fontSize: "0.9rem",
            color: "grey",
            backgroundColor: "#feecfe",
            borderRadius: "2.469rem",
            border: "none",
          }}
        >
          수업 종료
        </button>
      </div>

      {/* [오른쪽 블럭] 수업 Step 테이블, 수업 상태 테이블 */}
      <div style={{ width: "40%", marginRight: "30px" }}>
        <TeacherAssignmentTable
          setCourseStep={setCourseStep}
          setTableData={setTableData}
          lectureDataUuid={lectureDataUuid}
          setStepCount={setStepCount}
        />
        <TeacherCourseStatusTable
          stepCount={stepCount}
          eclassUuid={eClassUuid}
          sessionIds={sessionIds}
          assginmentShareCheck={assginmentShareCheck}
        />
      </div>
    </div>
  );
};
