import React, { useEffect } from 'react';

import './App.css';
import { Routes, Route } from 'react-router-dom';
import RegisterForm from './User/Register/RegisterForm';
import Home from './Homepage/Home';
import AddMACForm from './Admin/Device/AddMACForm';
import AddDevice from './Admin/Device/addDevice';
import LoginForm from './User/Login/LoginForm';
import Header from './Header/Header';
import RegisterStudents from './User/Educator/RegisterStudents';
import Footer from './Footer/Footer';
import Find from './User/Find/Find';
import Notice from './Contact/Announcement/Notice';
import Board from './Contact/Board/Board';
import Team from './About/Team/Team';
import What from './About/What/What';
import News from './Learnmore/News/News';
import Research from './Learnmore/Research/Research';

import Implementation from './Learnmore/Implementation/Implementation';
import EmailAuth from './User/Register/EmailAuth';
import AdminLogin from './Admin/Login/AdminLogin';
import DeviceList from './Admin/Device/DeviceList';
import ContactUs from './Contact/ContactUs/ContactUs';
import OpenApi from './Data/OpenAPIData/OpenApi';
import OpenApi2 from './Data/OpenAPIData/OpenApi2';
import OpenApiPast from './Data/OpenAPIData/openAPIPast';
import Search from './Data/OpenAPIData/search';
import MyData from './Data/MyData/myData';
import ReadExcel from './Data/MyData/readExcel';
import SEEdAppMain from './Data/SEEdApp/SEEdAppMain';

import DataInChartPage from './Data/DataInChart/Page/DataInChartPage';

import { useNavigate } from 'react-router-dom';
import EClassLivePage from './EClass/liveClass/page/EClassLivePage';
import ClassData from './EClass/classData/ClassData';
import { LiveTeacherPage } from './EClass/liveClass/page/LiveTeacherPage';
import { LiveStudentPage } from './EClass/liveClass/page/LiveStudentPage';
import Resource from './EducationResources/Resource';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const expiredAt = localStorage.getItem('expiredAt');

    if (expiredAt) {
      const currentTime = new Date();
      const expiredAtTime = new Date(expiredAt);

      // 1일이 더 지났다면 다시 로그인 해야 됨
      if (expiredAtTime < currentTime) {
        console.log('유효기간 만료 : ', expiredAtTime);
        localStorage.clear();
        navigate('/');
        window.location.reload();
      } else {
        console.log('유효기간 : ' + expiredAtTime);
      }
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Header />

      <div style={{ margin: '10rem 0 0 0 ' }}>
        <Routes>
          {/*home*/}
          <Route index element={<Home />} />
          {/*user*/}
          <Route path="/login" exact={true} element={<LoginForm />} />
          <Route path="/auth" exact={true} element={<EmailAuth />} />
          <Route path="/register" exact={true} element={<RegisterForm />} />
          <Route
            path="/educator/student/add"
            exact={true}
            element={<RegisterStudents />}
          />
          <Route path="/find" exact={true} element={<Find />} />
          {/*Admin*/}
          <Route path="/admin/login" exact={true} element={<AdminLogin />} />
          <Route path="/admin/devices" exact={true} element={<DeviceList />} />
          <Route
            path="/admin/add/device"
            exact={true}
            element={<AddDevice />}
          />
          <Route
            path="/admin/add/device"
            exact={true}
            element={<AddMACForm />}
          />
          {/*-------------------------------------------------- ABOUT ----------------------------------------------------*/}
          <Route path="/what" exact={true} element={<What />} />{' '}
          {/*What We Do*/}
          <Route path="/team" exact={true} element={<Team />} /> {/*Team*/}
          {/*GET STARTED*/}
          {/*DATA*/}
          <Route path="/socket" exact={true} element={<SEEdAppMain />} />{' '}
          {/*------------------------------------------------- myData -----------------------------------------------------*/}
          <Route path="/myData" exact={true} element={<MyData />} />{' '}
          {/*------------------------------------------------- Class Data -----------------------------------------------------*/}
          <Route path="/classData" exact={true} element={<ClassData />} />{' '}
          {/*My Data*/}
          <Route path="/readExcel" exact={true} element={<ReadExcel />} />
          <Route path="/search" exact={true} element={<Search />} />
          {/* ------------------------------------------------ Data&Chart ------------------------------------------------- */}
          <Route
            path="/data-in-chart"
            exact={true}
            element={<DataInChartPage />}
          />{' '}
          <Route path="/openAPI" exact={true} element={<OpenApi />} />{' '}
          <Route path="/openAPI2" exact={true} element={<OpenApi2 />} />{' '}
          <Route path="/resources" exact={true} element={<Resource />} />{' '}
          {/* --------------------------------------------------- E-Class------------------------------------------------------ */}
          <Route
            path="/EClassLivePage"
            exact={true}
            element={<EClassLivePage />}
          />
          <Route
            path="/LiveTeacherPage/:eClassUuid"
            exact={true}
            element={<LiveTeacherPage />}
          />
          <Route
            path="/LiveStudentPage/:eClassUuid"
            exact={true}
            element={<LiveStudentPage />}
          />
          {/* ------------------------------------------------- OPEN API -----------------------------------------------------*/}
          <Route path="/openAPI/past" exact={true} element={<OpenApiPast />} />
          {/* ------------------------------------------------- LERN MORE ----------------------------------------------------- */}
          <Route path="/news" exact={true} element={<News />} />
          <Route path="/research" exact={true} element={<Research />} />
          <Route
            path="/implementation"
            exact={true}
            element={<Implementation />}
          />
          {/* ------------------------------------------------- CONTACT -------------------------------------------------------*/}
          <Route path="/contact" exact={true} element={<ContactUs />} />{' '}
          {/*Contact us*/}
          <Route path="/notice" exact={true} element={<Notice />} />{' '}
          {/*Announcement*/}
          <Route path="/board" exact={true} element={<Board />} /> {/*Board*/}
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
