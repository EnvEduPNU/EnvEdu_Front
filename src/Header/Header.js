import React, { useEffect, useState, useRef } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { customAxios } from '../Common/CustomAxios';
import { PiPlant } from 'react-icons/pi';

function Header() {
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const [open, setOpen] = useState({
    about: false,
    app: false,
    dataChart: false,
    eClass: false,
    learnMore: false,
    contact: false,
  });

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

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavLinkClick = (path) => {
    if (location.pathname === path) {
      window.location.reload(); // 현재 페이지와 동일한 경로일 경우 페이지를 리로드
    } else {
      navigate(path); // 다른 경로일 경우 해당 경로로 이동
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.entries(refs).forEach(([key, ref]) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpen((prev) => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
    setUserRole(localStorage.getItem('role'));
  }, []);

  function logout() {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  }

  return (
    <div className="fixed-top">
      <Navbar style={{ height: '2em', fontSize: '0.8em' }} bg="light">
        <Container className="justify-content-end">
          <Nav>
            {username ? (
              <>
                <Nav.Link onClick={() => handleNavLinkClick('/')}>
                  {username}
                </Nav.Link>
                <span
                  className="nav-link"
                  style={{ cursor: 'pointer' }}
                  onClick={logout}
                >
                  LOGOUT
                </span>
              </>
            ) : (
              <>
                <Nav.Link onClick={() => handleNavLinkClick('/login')}>
                  로그인
                </Nav.Link>
                <Nav.Link onClick={() => handleNavLinkClick('/register')}>
                  회원가입
                </Nav.Link>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Navbar bg="light">
        <Container
          className="justify-content-between"
          style={{ height: '5em' }}
        >
          <Nav>
            <Nav.Link onClick={() => handleNavLinkClick('/')}>
              <PiPlant size="30" color="#2F5F3A" />
              <h4
                style={{
                  color: '#000',
                  fontWeight: 'bold',
                  marginLeft: '0.3rem',
                }}
              >
                SEEd
              </h4>
            </Nav.Link>
          </Nav>
          <Nav>
            {Object.keys(open).map((key) => (
              <NavDropdown
                key={key}
                title={key.replace(/^\w/, (c) => c.toUpperCase())}
                id={`nav-dropdown-${key}`}
                className="mx-2"
                style={{ fontSize: '1.2em' }}
                onClick={() => toggleDropdown(key)}
                show={open[key]}
                ref={refs[key]}
              >
                {(() => {
                  switch (key) {
                    case 'about':
                      return (
                        <>
                          <Nav.Link onClick={() => handleNavLinkClick('/what')}>
                            What We Do
                          </Nav.Link>
                          <Nav.Link onClick={() => handleNavLinkClick('/team')}>
                            Team
                          </Nav.Link>
                        </>
                      );
                    case 'app':
                      return (
                        <>
                          <Nav.Link
                            onClick={() => handleNavLinkClick('/socket')}
                          >
                            측정하기
                          </Nav.Link>
                        </>
                      );
                    case 'dataChart':
                      return (
                        <>
                          <Nav.Link
                            onClick={() => handleNavLinkClick('/data-in-chart')}
                          >
                            Tutorial
                          </Nav.Link>
                          <Nav.Link
                            onClick={() => handleNavLinkClick('/data-in-chart')}
                          >
                            Data & Chart
                          </Nav.Link>
                          <Nav.Link
                            onClick={() => handleNavLinkClick('/openapi')}
                          >
                            Open API Data
                          </Nav.Link>

                          <Nav.Link
                            onClick={() => handleNavLinkClick('/myData')}
                          >
                            My Data
                          </Nav.Link>
                        </>
                      );
                    case 'eClass':
                      return (
                        <>
                          {userRole === 'ROLE_EDUCATOR' && (
                            <Nav.Link
                              onClick={() => handleNavLinkClick('/classData')}
                            >
                              E-Class 생성
                            </Nav.Link>
                          )}
                          <Nav.Link
                            onClick={() =>
                              handleNavLinkClick('/EClassLivePage')
                            }
                          >
                            E-Class 실행
                          </Nav.Link>

                          <Nav.Link
                            onClick={() => handleNavLinkClick('/resources')}
                          >
                            Education Resources
                          </Nav.Link>
                        </>
                      );
                    case 'learnMore':
                      return (
                        <>
                          <Nav.Link onClick={() => handleNavLinkClick('/news')}>
                            News
                          </Nav.Link>
                          <Nav.Link
                            onClick={() => handleNavLinkClick('/research')}
                          >
                            Research
                          </Nav.Link>
                          <Nav.Link
                            onClick={() => handleNavLinkClick('/training')}
                          >
                            Training
                          </Nav.Link>
                          <Nav.Link
                            onClick={() =>
                              handleNavLinkClick('/implementation')
                            }
                          >
                            Implementation
                          </Nav.Link>
                        </>
                      );
                    case 'contact':
                      return (
                        <>
                          <Nav.Link
                            onClick={() => handleNavLinkClick('/contact')}
                          >
                            Contact us
                          </Nav.Link>
                          <Nav.Link
                            onClick={() => handleNavLinkClick('/notice')}
                          >
                            Announcement
                          </Nav.Link>
                          <Nav.Link
                            onClick={() => handleNavLinkClick('/board')}
                          >
                            Board
                          </Nav.Link>
                        </>
                      );
                    default:
                      return null;
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
