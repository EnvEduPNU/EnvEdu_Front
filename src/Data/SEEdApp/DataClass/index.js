import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";
import cardImg from "./card.jpg";
import { getEclassDetail, getEclassList } from "../EClass/api/eclassApi";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Badge, Stack } from "react-bootstrap";

export default function EClassList() {
  const naviate = useNavigate();
  const [eclasses, setEclasses] = useState([]);
  const [isShow, setShow] = useState(false);

  useEffect(() => {
    getEclassList()
      .then(res => setEclasses(res.data))
      .catch(error => console.error(error));

      if (localStorage.getItem('role') === 'ROLE_STUDENT') {
        setShow(true);
      }
  }, []);

  return (
    <Wrapper>
      {isShow && <a href="/invite" target="_blank" style={{ textDecoration: 'none' }}>
        <Button variant="success">초대 코드 입력</Button>
      </a>}

      <h3 style={{ margin: "2rem 0" }}>E-class 목록</h3>
      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        <Card style={{ width: "18rem", height: "400px", cursor: "pointer" }}>
          <div
            onClick={() => {
              naviate("/E-Classes/new");
            }}
            style={{
              fontSize: "18px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          >
            <span>+ E-class 생성하기</span>
          </div>
        </Card>
        {eclasses.map((eclass, idx) => (
          <Card
            key={idx}
            style={{ width: "18rem", height: "400px", cursor: "pointer" }}
            onClick={() => naviate(`/slide/${eclass.id}`)}
          >
            <Card.Img variant="top" src={cardImg} />
            <Stack
              direction="horizontal"
              gap={2}
              style={{
                justifyContent: "flex-end",
                padding: "10px 0",
                paddingRight: "10px",
              }}
            >
              <Badge bg="primary">{eclass?.gradeLabel}</Badge>
              <Badge bg="info">{eclass?.subjectLabel}</Badge>
              <Badge bg="dark">{eclass?.dataTypeLabel}</Badge>
            </Stack>
            <Card.Body>
              <Card.Title style={{ fontWeight: "bold" }}>
                {eclass.title}
              </Card.Title>
              <Card.Text style={{ marginTop: "1rem" }}>
                {eclass.description}
              </Card.Text>
              {/* <a href="/slide" target="_blank">
                <Button variant="primary" style={{ width: "7rem" }}>
                  Start
                </Button>
              </a> */}
            </Card.Body>
          </Card>
        ))}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
