import React, { useEffect, useState } from 'react';
import './Header.css';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { decodeToken, isExpired } from 'react-jwt';
import { customAxios } from '../Common/CustomAxios';
import { RESPONSE_BAD_REQ, RESPONSE_OK } from '../Common/Response';

function Header() {
  const [username, setUsername] = useState('');
  useEffect(() => {
    if (isExpired(localStorage.getItem('refresh')) === true) {
      localStorage.clear();
      setUsername('');
    } else {
      setUsername(decodeToken(localStorage.getItem('refresh')).username);
    }
  }, [isExpired(localStorage.getItem('refresh'))]);

  function logout() {
    customAxios.post('/logout').then((response) => {
      if (response.data.code === RESPONSE_OK) {
        localStorage.clear();
        alert('로그아웃 성공');
      } else if (response.data.code === RESPONSE_BAD_REQ) {
        alert('로그아웃 실패');
      }
    });
  }

  return (
    <div className="fixed-top">
      <div>
        <Navbar style={{ height: '2em', fontSize: '0.8em' }} bg="light">
          <Container className="justify-content-end">
            <Nav>
              {isExpired(localStorage.getItem('refresh')) === true ? (
                <>
                  <NavLink className={'nav-link'} to="/login">
                    LOGIN
                  </NavLink>
                  <NavLink className={'nav-link'} to="/register">
                    JOIN US
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
                <NavLink className={'nav-link'} to="/">
                  My data
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
              </NavDropdown>
            </Nav>
          </Container>
        </Navbar>
      </div>
    </div>
  );
}

export default Header;
