import React, { useState } from 'react';
import './Header.scss';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { customAxios } from '../Common/CustomAxios';
import { PiPlant } from "react-icons/pi";

function Header() {
  /**
   * 로그인 성공 시, UI에 변화룰 주기 위한 state
   */
  const [username] = useState(localStorage.getItem('username'));


  /**
   * 로그아웃 성공 시, 단순히 한 번 새로고침해 UI에 변경 반영
   */
  const navigate = useNavigate('');
  function logout() {
    customAxios.post('/logout').then(() => {
      localStorage.clear();
      navigate('/');
      window.location.reload();
    });
  }

  return (
    <div className="fixed-top">
      <div>
        <Navbar style={{ height: '2em', fontSize: '0.8em' }} bg="light">
          <Container className="justify-content-end">
            <Nav>
              {username === null ||
                username === undefined
                ? (
                  <>
                    <NavLink className={'nav-link'} to="/login">
                      LOGIN
                    </NavLink>
                    {
                      /**
                       * 오직 header를 통해 회원가입을 할 수 있도록 설정
                       * 이 부분에서 state를 회원가입을 위한 컴포넌트로 넘겨줬을 때만 정상 동작
                       */
                    }
                    <NavLink className={'nav-link'} to="/auth" state={{ role: "ROLE_STUDENT" }}>
                      JOIN US(student)
                    </NavLink>
                    <NavLink className={'nav-link'} to="/auth" state={{ role: "ROLE_EDUCATOR" }}>
                      JOIN US(educator)
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      className={'nav-link'}
                      to="/"
                      style={{ color: 'black' }}
                    >
                      {username}
                    </NavLink>
                    <span
                      className={'nav-link'}
                      style={{ color: 'black', cursor: 'pointer' }}
                      onClick={logout}
                    >
                      LOGOUT
                    </span>
                  </>
                )}
            </Nav>
          </Container>
        </Navbar>
      </div>
      <div>
        <Navbar bg="light">
          <Container
            className="justify-content-between"
            style={{ height: '5em' }}
          >
            <Nav>
              <NavLink className="nav-link" to="/" style={{ display: 'flex' }}>
                <PiPlant size="30" color="#2F5F3A" />
                <h4 style={{ color: '#000', fontWeight: 'bold', marginLeft: '0.3rem' }}>SEEd</h4>
              </NavLink>
            </Nav>
            <Nav>
              <NavDropdown
                title="ABOUT"
                id="basic-nav-dropdown"
                className={'mx-2'}
                style={{ fontSize: '1.2em' }}
              >
                <NavLink className={'nav-link'} to="/what">
                  What We Do
                </NavLink>
                <NavLink className={'nav-link'} to="/team">
                  Team
                </NavLink>
                <NavLink className={'nav-link'} to="/">
                  Projects
                </NavLink>
              </NavDropdown>
              <NavDropdown
                title="GET STARTED"
                id="basic-nav-dropdown"
                className={'mx-2'}
                style={{ fontSize: '1.2em' }}
              >
                <NavLink className={'nav-link'} to="/">
                  SEEd Platform
                </NavLink>
                <NavLink className={'nav-link'} to="/">
                  SEEd Device
                </NavLink>
                <NavLink className={'nav-link'} to="/">
                  E-class manual
                </NavLink>
                <NavLink className={'nav-link'} to="/">
                  Data Literacy
                </NavLink>
              </NavDropdown>
              <NavDropdown
                title="DATA"
                id="basic-nav-dropdown"
                className={'mx-2'}
                style={{ fontSize: '1.2em' }}
              >
                <NavLink className={'nav-link'} to="/socket">
                  SEEd App
                </NavLink>
                <NavLink className={'nav-link'} to="/myData">
                  My Data
                </NavLink>
                <NavLink className={'nav-link'} to="/openapi">
                  Open API Data
                </NavLink>
                <NavLink className={'nav-link'} to="/">
                  Data In Textbooks
                </NavLink>
              </NavDropdown>
              <NavDropdown
                title="EDUCATION"
                id="basic-nav-dropdown"
                className={'mx-2'}
                style={{ fontSize: '1.2em' }}
              >
                <NavLink className={'nav-link'} to="/E-Classes">
                  E-Class
                </NavLink>
                <NavLink className={'nav-link'} to="/">
                  E-Class Library
                </NavLink>
                <NavLink className={'nav-link'} to="/dataLiteracy/dataLoad">
                  Data Literacy
                </NavLink>
                <NavLink className={'nav-link'} to="/">
                  Education Resources
                </NavLink>
                <NavLink className={'nav-link'} to="/">
                  Survey
                </NavLink>
              </NavDropdown>
              <NavDropdown
                title="LEARN MORE"
                id="basic-nav-dropdown"
                style={{ fontSize: '1.2em' }}
                className={'mx-2'}
              >
                <NavLink className={'nav-link'} to="/news_reserch">
                  News
                </NavLink>
                <NavLink className={'nav-link'} to="/news_reserch">
                  Research
                </NavLink>
                <NavLink className={'nav-link'} to="/training">
                  Training
                </NavLink>
                <NavLink className={'nav-link'} to="/training">
                  Implementation
                </NavLink>
                {/*
                <NavLink className={'nav-link'} to="/resourceBoard">
                  Education Resources
                </NavLink>
                */}
              </NavDropdown>
              <NavDropdown
                title="CONTACT"
                id="basic-nav-dropdown"
                style={{ fontSize: '1.2em' }}
                className={'mx-2'}
              >
                <NavLink className={'nav-link'} to="/">
                  Contact us
                </NavLink>
                <NavLink className={'nav-link'} to="/">
                  Announcement
                </NavLink>
                <NavLink className={'nav-link'} to="/board">
                  Board
                </NavLink>
                {/*
                <NavLink className={'nav-link'} to="/notice">
                  공지
                </NavLink>
                */}
              </NavDropdown>
            </Nav>
          </Container>
        </Navbar>
      </div>
    </div>
  );
}

export default Header;
