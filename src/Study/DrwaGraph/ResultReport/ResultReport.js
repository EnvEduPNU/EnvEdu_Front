import CustomChart from "../CustomChart/CustomChart";
import CustomTable from "../CustomTable/CustomTable";
import * as Styled from "./Styled";
import makePdf from "../../../DataLiteracy/utils/makePdf";
import Textarea from "../../../DataLiteracy/common/Textarea/Textarea";
import { useReportStore } from "../../store/reportStore";
import CustomReportTable from "../CustomTable/CustomReportTable";
import Button from "react-bootstrap/Button";
import { customAxios } from "../../../Common/CustomAxios";
import { useGraphDataStore } from "../../store/graphStore";
import { Form } from "react-bootstrap";
import { useState } from "react";
import { useTabStore } from "../../store/tabStore";

//항목 이름 (한국어 -> 영어)
const engToKor = name => {
  const kor = {
    //수질 데이터
    PTNM: "조사지점명",
    WMYR: "측정연도",
    WMOD: "측정월",
    ITEMTEMP: "수온(°C)",
    ITEMPH: "pH",
    ITEMDOC: "DO(㎎/L)",
    ITEMBOD: "BOD(㎎/L)",
    ITEMCOD: "COD(㎎/L)",
    ITEMTN: "총질소(㎎/L)",
    ITEMTP: "총인(㎎/L)",
    ITEMTRANS: "투명도(㎎/L)",
    ITEMCLOA: "클로로필-a(㎎/L)",
    ITEMEC: "전기전도도(µS/㎝)",
    ITEMTOC: "TOC(㎎/L)",

    //대기질 데이터
    stationName: "조사지점명",
    dataTime: "측정일",
    so2Value: "아황산가스 농도(ppm)",
    coValue: "일산화탄소 농도(ppm)",
    o3Value: "오존 농도(ppm)",
    no2Value: "이산화질소 농도(ppm)",
    pm10Value: "미세먼지(PM10) 농도(㎍/㎥)",
    pm25Value: "미세먼지(PM2.5)  농도(㎍/㎥)",

    //SEED 데이터
    measuredDate: "측정 시간",
    location: "측정 장소",
    unit: "소속",
    period: "저장 주기",
    username: "사용자명",
    hum: "습도",
    temp: "기온",
    tur: "탁도",
    ph: "pH",
    dust: "미세먼지",
    dox: "용존산소량",
    co2: "이산화탄소",
    lux: "조도",
    hum_EARTH: "토양 습도",
    pre: "기압",
  };
  return kor[name] || name;
};

function ResultReport() {
  const { activities, writeAnswer } = useReportStore();
  const { setData } = useGraphDataStore();
  const { changeTab } = useTabStore();
  const [title, setTitle] = useState("");
  const [opinion, setOpinion] = useState("");

  const getTable = (type, id) => {
    let path = "";
    if (type === "OCEANQUALITY") {
      path = `/ocean-quality/mine/chunk?dataUUID=${id}`;
    } else if (type === "AIRQUALITY") {
      path = `/air-quality/mine/chunk?dataUUID=${id}`;
    } else if (type === "SEED") {
      path = `/seed/mine/chunk?dataUUID=${id}`;
    }

    customAxios
      .get(path)
      .then(res => {
        let headers = Object.keys(res.data[0]).filter(
          key =>
            key !== "id" &&
            key !== "dataUUID" &&
            key !== "saveDate" &&
            key !== "dateString"
        );

        const attributesToCheck = [
          "co2",
          "dox",
          "dust",
          "hum",
          "hum_EARTH",
          "lux",
          "ph",
          "pre",
          "temp",
          "tur",
        ];

        for (const attribute of attributesToCheck) {
          const isAllZero = res.data.every(item => item[attribute] === 0);
          // 해당 속성이 모두 0일 때, headers에서 제거
          if (isAllZero) {
            headers = headers.filter(header => header !== attribute);
          }
        }

        headers = headers.map(header => engToKor(header));

        // 각각의 딕셔너리에서 값만 추출하여 리스트로 변환
        const keysToExclude = ["id", "dataUUID", "saveDate", "dateString"];

        const values = res.data.map(item => {
          const filteredItem = Object.keys(item)
            .filter(key => !keysToExclude.includes(key))
            .reduce((obj, key) => {
              obj[key] = item[key];
              return obj;
            }, {});
          return Object.values(filteredItem);
        });

        // 최종 결과 생성 (헤더 + 값)
        const recombined = [headers, ...values];
        setData(recombined);
        localStorage.setItem("data", JSON.stringify(recombined));
        window.location.reload();
      })
      .catch(err => console.log(err));
  };

  const onClick = async e => {
    e.preventDefault();
    await makePdf.viewWithPdf();
  };

  const getData = () => {
    customAxios
      .get("/mydata/list")
      .then(res => {
        const lastElement = res.data[res.data.length - 1];
        const type = lastElement.dataLabel;
        const id = lastElement.dataUUID;
        getTable(type, id);
      })
      .catch(err => console.log(err));
  };

  const submitOpinion = () => {
    customAxios
      .post("/dataLiteracy/sequenceData/reply", {
        title: title,
        content: opinion,
        classId: 1,
        chapterId: 1,
        sequenceId: 1,
      })
      .then(res => {
        alert("의견이 제출되었습니다.");
      })
      .catch(err => console.log(err));
  };

  return (
    <Styled.Wrapper className="div_container">
      <Styled.Paper className="div_paper">
        <Styled.Box>
          <Styled.Title>#REPORT 우리학교 공기질 측정하기 - 이재훈</Styled.Title>
        </Styled.Box>
        <Styled.Box>
          <div>
            <h4 style={{ textAlign: "center", marginTop: "1rem" }}>
              우리 학교의 공기질 측정하기
            </h4>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "3rem 0",
              }}
            >
              <div>
                <span>1차시: 교실의 공기질 측정하기</span>
                <br />
                2차시 : 학교의 여러장소 공기질 측정하기
                <br />
                3차시 : 교실과 학교의 장소별 공기질 비교하기
              </div>
            </div>
          </div>
        </Styled.Box>
      </Styled.Paper>
      {activities.map((activity, idx) => (
        <Styled.Paper key={idx} className="div_paper">
          <Styled.Box>
            <Styled.Title>{activity.question}</Styled.Title>
            {activity.type === "text" && (
              <Textarea
                value={activity.answer || ""}
                onChange={e => writeAnswer(idx, e.target.value)}
              />
            )}
            {activity.type === "seed" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <a href="/socket" target="_blank">
                  <Button variant="dark" style={{ marginTop: "2rem" }}>
                    측정하러 가기
                  </Button>
                </a>

                <Button
                  variant="dark"
                  style={{ marginTop: "0.5rem" }}
                  onClick={getData}
                >
                  측정한 값 가져오기
                </Button>
              </div>
            )}

            {activity.type === "discussion" && (
              <>
                <div style={{ margin: "1rem 3rem" }}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>조 이름</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={1}
                      onChange={e => setTitle(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea2"
                  >
                    <Form.Label>토론 내용 입력</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      onChange={e => setOpinion(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Button
                    variant="dark"
                    style={{ marginTop: "0.5rem" }}
                    onClick={submitOpinion}
                  >
                    제출하기
                  </Button>
                </div>
              </>
            )}
            {activity.type === "fill_table" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "30px",
                }}
              >
                <Button
                  variant="dark"
                  style={{ marginTop: "0.5rem", alignSelf: "center" }}
                  onClick={() => changeTab("table")}
                >
                  표 채우러 가기
                </Button>

                <Form.Group>
                  <Form.Label>작성한 표</Form.Label>
                  <CustomReportTable data={activity.answer || [[]]} />
                </Form.Group>
              </div>
            )}
            {activity.type === "graph" && (
              <div
                style={{
                  display: "flex",
                  // alignItems: "center",
                  flexDirection: "column",
                  gap: "30px",
                }}
              >
                <Button
                  variant="dark"
                  style={{ marginTop: "0.5rem", alignSelf: "center" }}
                  onClick={() => changeTab("graph")}
                >
                  그래프 그리러 가기
                </Button>

                {activity.answer !== null && (
                  <Form.Group>
                    <Form.Label>제출한 그래프</Form.Label>
                    <CustomChart />
                  </Form.Group>
                )}
              </div>
            )}
            {activity.type === "none" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                (1) 15분은 창문을 닫은 상태로 측정하기
                <a href="/socket" target="_blank">
                  <Button variant="dark" style={{ margin: "0.5rem 0" }}>
                    측정하러 가기
                  </Button>
                </a>
                <Button
                  variant="dark"
                  style={{ marginBottom: "1rem", alignSelf: "center" }}
                  onClick={getData}
                >
                  측정한 값 가져오기
                </Button>
                <br />
                (2) 15분은 창문을 연 상태로 측정하기
                <a href="/socket" target="_blank">
                  <Button variant="dark" style={{ margin: "0.5rem 0" }}>
                    측정하러 가기
                  </Button>
                </a>
                <Button
                  variant="dark"
                  style={{ marginBottom: "1rem", alignSelf: "center" }}
                  onClick={getData}
                >
                  측정한 값 가져오기
                </Button>
                <br />
                (3) 측정 결과 예상하기 및 이유 작성하기
                {/* </div> */}
                <div style={{ margin: "1rem 3rem" }}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>조 이름</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={1}
                      onChange={e => setTitle(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>토론 내용 입력</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      onChange={e => setOpinion(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Button
                    variant="dark"
                    style={{ marginTop: "0.5rem" }}
                    onClick={submitOpinion}
                  >
                    제출하기
                  </Button>
                </div>
              </div>
            )}
          </Styled.Box>
        </Styled.Paper>
      ))}
      {/* <Styled.Paper className="div_paper">
        <Styled.Box>
          <Styled.Title>활동1: 교실의 공기질 측정하기</Styled.Title>
          <CustomTable isChangeCategory={false} />
        </Styled.Box>
      </Styled.Paper>
      <Styled.Paper className="div_paper">
        <Styled.Box>
          <Styled.Title>
            활동2: 측정된 현재 데이터와 대기환경 기준 비교하고 이유 토론하기
          </Styled.Title>
          <Textarea value={"학생들이 입력한 내용이 들어갑니다."} />
        </Styled.Box>
      </Styled.Paper>
      <Styled.Paper className="div_paper">
        <Styled.Box>
          <Styled.Title>활동3: 그래프 만들어보기</Styled.Title>
          <CustomChart />
        </Styled.Box>
      </Styled.Paper> */}

      <button className="pdfBtn" onClick={onClick}>
        pdf로 보기
      </button>
    </Styled.Wrapper>
  );
}

export default ResultReport;
