import React, { useState } from 'react';
import './Header.css';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { customAxios } from '../Common/CustomAxios';

function Header() {
  /**
   * 로그인 성공 시, UI에 변화룰 주기 위한 state
   */
  const [username] = useState(localStorage.getItem('username'));


  /**
   * 로그아웃 성공 시, 단순히 한 번 새로고침해 UI에 변경 반영
   */
  function logout() {
    customAxios.post('/logout').then(() => {
      localStorage.clear();
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
              <NavLink className="nav-link" to="/" style={{ color: 'black' }}>
                <h4>SEEd</h4>
              </NavLink>
            </Nav>
            <Nav>
              <NavDropdown
                title="DATA"
                id="basic-nav-dropdown"
                className={'mx-2'}
                style={{ fontSize: '1.2em' }}
              >
                <NavLink className={'nav-link'} to="/">
                  SEEd Device
                </NavLink>
                <NavLink className={'nav-link'} to="/">
                  Data portal
                </NavLink>
                <NavLink className={'nav-link'} to="/myData">
                  My data
                </NavLink>
                <NavLink className={'nav-link'} to="/openapi">
                  Open Api Data
                </NavLink>
                <NavLink className={'nav-link'} to="/socket">
                  SEEd 측정 기기
                </NavLink>
              </NavDropdown>
              <NavDropdown
                title="ABOUT"
                id="basic-nav-dropdown"
                className={'mx-2'}
                style={{ fontSize: '1.2em' }}
              >
                <NavLink className={'nav-link'} to="/what">
                  What we do
                </NavLink>
                <NavLink className={'nav-link'} to="/team">
                  TEAM
                </NavLink>
                <NavLink className={'nav-link'} to="/">
                  Community
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
                  Using SEEd platform
                </NavLink>
                <NavLink className={'nav-link'} to="/">
                  SEEd Device manual
                </NavLink>
                <NavLink className={'nav-link'} to="/">
                  Data manual
                </NavLink>
                <NavLink className={'nav-link'} to="/">
                  FAQs
                </NavLink>
              </NavDropdown>
              <NavDropdown
                title="EDUCATION"
                id="basic-nav-dropdown"
                className={'mx-2'}
                style={{ fontSize: '1.2em' }}
              >
                <NavLink className={'nav-link'} to="/">
                  Start E-Classes
                </NavLink>
                <NavLink className={'nav-link'} to="/">
                  E-Classes
                </NavLink>
                <NavLink className={'nav-link'} to="/">
                  Project reports
                </NavLink>
              </NavDropdown>
              <NavDropdown
                title="LEARN MORE"
                id="basic-nav-dropdown"
                style={{ fontSize: '1.2em' }}
                className={'mx-2'}
              >
                <NavLink className={'nav-link'} to="/news_reserch">
                  News and Research
                </NavLink>
                <NavLink className={'nav-link'} to="/resourceBoard">
                  Education Resources
                </NavLink>
                <NavLink className={'nav-link'} to="/training">
                  Training and implementation
                </NavLink>
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
                  SEEd 기기 대여
                </NavLink>
                <NavLink className={'nav-link'} to="/">
                  연수 신청
                </NavLink>
                <NavLink className={'nav-link'} to="/board">
                  Board
                </NavLink>
                <NavLink className={'nav-link'} to="/notice">
                  공지
                </NavLink>
              </NavDropdown>
            </Nav>
          </Container>
        </Navbar>
      </div>
    </div>
  );
}

export default Header;
