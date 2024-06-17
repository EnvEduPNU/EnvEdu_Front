import React, { useEffect, useState, useRef } from "react";
import "./Header.scss";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { customAxios } from "../Common/CustomAxios";
import { PiPlant } from "react-icons/pi";

function Header() {
  const [username, setUsername] = useState(null);
  const [open, setOpen] = useState({
    about: false,
    app: false,
    dataChart: false,
    eClass: false,
    learnMore: false,
    contact: false,
  });
  // 각 NavDropdown에 대한 ref 생성
  const refs = {
    about: useRef(null),
    app: useRef(null),
    dataChart: useRef(null),
    eClass: useRef(null),
    learnMore: useRef(null),
    contact: useRef(null),
  };

  const toggleDropdown = (id) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 외부 클릭 감지를 위한 로직
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.entries(refs).forEach(([key, ref]) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpen((prev) => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // 의존성 배열을 비워 초기 마운트 때만 이벤트 리스너 등록

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

  const navigate = useNavigate();
  function logout() {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  }

  return (
    <div className="fixed-top">
      <Navbar style={{ height: "2em", fontSize: "0.8em" }} bg="light">
        <Container className="justify-content-end">
          <Nav>
            {username ? (
              <>
                <NavLink className="nav-link" to="/" style={{ color: "black" }}>
                  {username}
                </NavLink>
                <span
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                  onClick={logout}
                >
                  LOGOUT
                </span>
              </>
            ) : (
              <>
                <NavLink className="nav-link" to="/login">
                  LOGIN
                </NavLink>
                <NavLink
                  className="nav-link"
                  to="/auth"
                  state={{ role: "ROLE_STUDENT" }}
                >
                  JOIN US(student)
                </NavLink>
                <NavLink
                  className="nav-link"
                  to="/auth"
                  state={{ role: "ROLE_EDUCATOR" }}
                >
                  JOIN US(educator)
                </NavLink>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Navbar bg="light">
        <Container
          className="justify-content-between"
          style={{ height: "5em" }}
        >
          <Nav>
            <NavLink className="nav-link" to="/" style={{ display: "flex" }}>
              <PiPlant size="30" color="#2F5F3A" />
              <h4
                style={{
                  color: "#000",
                  fontWeight: "bold",
                  marginLeft: "0.3rem",
                }}
              >
                SEEd
              </h4>
            </NavLink>
          </Nav>
          <Nav>
            {Object.keys(open).map((key) => (
              <NavDropdown
                key={key}
                title={key.replace(/^\w/, (c) => c.toUpperCase())}
                id={`nav-dropdown-${key}`}
                className="mx-2"
                style={{ fontSize: "1.2em" }}
                onClick={() => toggleDropdown(key)}
                show={open[key]}
                ref={refs[key]}
              >
                {(() => {
                  switch (key) {
                    case "about":
                      return (
                        <>
                          <NavLink className={"nav-link"} to="/what">
                            What We Do
                          </NavLink>
                          <NavLink className={"nav-link"} to="/team">
                            Team
                          </NavLink>
                        </>
                      );
                    case "app":
                      return (
                        <>
                          <NavLink className={"nav-link"} to="/socket">
                            측정하기
                          </NavLink>
                        </>
                      );
                    case "dataChart":
                      return (
                        <>
                          <NavLink className={"nav-link"} to="/data-in-chart">
                            Tutorial
                          </NavLink>
                          <NavLink className={"nav-link"} to="/data-in-chart">
                            Data & Chart
                          </NavLink>
                          <NavLink className={"nav-link"} to="/openapi">
                            Open API Data
                          </NavLink>
                          <NavLink className={"nav-link"} to="/textbook">
                            Data In Textbooks
                          </NavLink>
                          <NavLink className={"nav-link"} to="/resource">
                            Education Resources
                          </NavLink>
                        </>
                      );
                    case "eClass":
                      return (
                        <>
                          <NavLink className={"nav-link"} to="/E-Classes">
                            E-Class
                          </NavLink>
                          <NavLink className={"nav-link"} to="/myData">
                            My Data
                          </NavLink>
                        </>
                      );
                    case "learnMore":
                      return (
                        <>
                          <NavLink className={"nav-link"} to="/news">
                            News
                          </NavLink>
                          <NavLink className={"nav-link"} to="/research">
                            Research
                          </NavLink>
                          <NavLink className={"nav-link"} to="/training">
                            Training
                          </NavLink>
                          <NavLink className={"nav-link"} to="/implementation">
                            Implementation
                          </NavLink>
                        </>
                      );
                    case "contact":
                      return (
                        <>
                          <NavLink className={"nav-link"} to="/contact">
                            Contact us
                          </NavLink>
                          <NavLink className={"nav-link"} to="/notice">
                            Announcement
                          </NavLink>
                          <NavLink className={"nav-link"} to="/board">
                            Board
                          </NavLink>
                        </>
                      );
                    default:
                      return null; // 기본적으로 아무 내용도 렌더링하지 않음
                  }
                })()}
              </NavDropdown>
            ))}
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
