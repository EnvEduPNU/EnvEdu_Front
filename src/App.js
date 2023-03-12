import './App.css';
import { Routes, Route } from 'react-router-dom';
import RegisterForm from './User/Register/RegisterForm';
import HomePage from './HomePage';
import EducatorRegisterForm from './User/Register/EducatorRegisterForm';
import UserAuthentication from './User/Register/UserAuthentication';
import AddMACForm from './Device/Manager/AddMACForm';
import LoginForm from './User/Login/LoginForm';
import ConnectPage from './Socket/ConnectPage';
import RegisterDeviceForm from './Device/User/RegisterDeviceForm';
import Header from './Header/Header';
import TestSocket from './Test/SocketTest';
import TestFetch from './Test/TestFetch';
import RegisterStudent from './User/Educator/RegisterStudent';
import Footer from './Footer/Footer';
import Find from './User/Find/Find';
import Board from './Board/Board';
import Board_content from './Board/Board_content';
import Team from './About/Team/Team';
import What from './About/What/What';
import Training from './Learnmore/Training';
import News from './Learnmore/News';

function App() {
  return (
    <>
      <Header />
      <div className="wrap">
        <Routes>
          {/*home*/}
          <Route index element={<HomePage />} />
          {/*user*/}
          <Route path="/register" exact={true} element={<RegisterForm />} />
          <Route
            path="/register/authentication"
            exact={true}
            element={<UserAuthentication />}
          />
          <Route
            path="/register/educator"
            exact={true}
            element={<EducatorRegisterForm />}
          />
          {/*device*/}
          <Route
            path="/manager/add/device"
            exact={true}
            element={<AddMACForm />}
          />
          <Route
            path="/user/add/device"
            exact={true}
            element={<RegisterDeviceForm />}
          />
          {/*login*/}
          <Route path="/login" exact={true} element={<LoginForm />} />
          {/*socket*/}
          <Route path="/socket" exact={true} element={<ConnectPage />} />
          {/*test*/}
          <Route path="/test/socket" exact={true} element={<TestSocket />} />
          <Route path="/test/fetch" exact={true} element={<TestFetch />} />
          <Route
            path="/test/student/add"
            exact={true}
            element={<RegisterStudent />}
          />
          {/*id_password_find*/}
          <Route path="/find" exact={true} element={<Find/>} />
          {/*board*/}
          <Route path="/board" exact={true} element={<Board/>} />
          <Route path="/boardcontent" exact={true} element={<Board_content/>} />
          {/*About*/}
          <Route path="/team" exact={true} element={<Team/>} />

          <Route path="/what" exact={true} element={<What/>} />

          {/*Learnmore*/}
          <Route path="/training" exact={true} element={<Training/>} />
          <Route path="/news_reserch" exact={true} element={<News/>} />

        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
