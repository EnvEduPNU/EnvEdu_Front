import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import RegisterForm from "./User/Register/RegisterForm";
import HomePage from "./HomePage";
import AddMACForm from "./Device/Manager/AddMACForm";
import AddDevice from "./Admin/Device/addDevice";
import LoginForm from "./User/Login/LoginForm";
import ConnectPage from "./Socket/ConnectPage";
import Header from "./Header/Header";
import TestSocket from "./Test/SocketTest";
import TestFetch from "./Test/TestFetch";
import RegisterStudents from "./User/Educator/RegisterStudents";
import Footer from "./Footer/Footer";
import Find from "./User/Find/Find";
import Notice from "./Board/Notice/Notice";
import Board from "./Board/Board";
import Board_content from "./Board/Board_content";
import Team from "./About/Team/Team";
import What from "./About/What/What";
import Training from "./Learnmore/Train/Training";
import News from "./Learnmore/News/News";
import EmailAuth from "./User/Register/EmailAuth";
import AdminLogin from "./Admin/Login/AdminLogin";
import DeviceList from "./Admin/Device/DeviceList";
import ContactUs from "./Contact/ContactUs";
import Resource from "./Learnmore/Resource/Resource";
import Tboard from "./Learnmore/Train/Tborad";
import OpenApi from "./OpenApi/OpenApi";
import OpenApiPast from "./OpenApi/openAPIPast";
import Search from "./OpenApi/search";
import MyData from "./myData/myData";
import ReadExcel from "./myData/readExcel";

import Measure from "./Education/Measure/measure";
import Sample from "./Socket/sample";

import MeasureContinuous from "./Education/Measure/measure_continuous";
import DrawGraph from "./DataLiteracy/DrawGraph/DrawGraph";
import GraphInterpreterPage from "./DataLiteracy/GraphInterpreter/GraphInterpreterPage";

function App() {
  /**
   * 처음에 반드시 .env 파일 생성 후 REACT_APP_API_URL = ${서버 도메인} 작성
   */
  useEffect(() => {
    //todo: check validity of refresh token(cookie)
  }, []);
  return (
    <>
      <Header />
      <div className="wrap">
        <Routes>
          {/*home*/}
          <Route index element={<HomePage />} />

          {/*user*/}
          <Route path="/auth" exact={true} element={<EmailAuth />} />
          <Route path="/register" exact={true} element={<RegisterForm />} />

          <Route
            path="/educator/student/add"
            exact={true}
            element={<RegisterStudents />}
          />

          {/*open API*/}
          <Route path="/openAPI" exact={true} element={<OpenApi />} />
          <Route path="/openAPI/past" exact={true} element={<OpenApiPast />} />
          <Route path="/search" exact={true} element={<Search />} />
          <Route path="/myData" exact={true} element={<MyData />} />
          <Route path="/readExcel" exact={true} element={<ReadExcel />} />

          {/*login*/}
          <Route path="/login" exact={true} element={<LoginForm />} />

          {/*socket*/}
          <Route path="/socket" exact={true} element={<Sample />} />
          {/*<Route path="/sample" exact={true} element={<Sample />} />*}

          {/*test*/}
          <Route path="/test/socket" exact={true} element={<TestSocket />} />
          <Route path="/test/fetch" exact={true} element={<TestFetch />} />

          {/*id_password_find*/}
          <Route path="/find" exact={true} element={<Find />} />

          {/*board*/}
          <Route path="/board" exact={true} element={<Board />} />
          <Route path="/notice" exact={true} element={<Notice />} />
          <Route
            path="/boardcontent"
            exact={true}
            element={<Board_content />}
          />

          {/*About*/}
          <Route path="/team" exact={true} element={<Team />} />
          <Route path="/what" exact={true} element={<What />} />

          {/*Education */}
          {/*<Route path="/E-Classes" exact={true} element={<Test/>} />*/}
          <Route path="/measure" exact={true} element={<Measure />} />
          <Route
            path="/measureContinuous"
            exact={true}
            element={<MeasureContinuous />}
          />

          {/*Learnmore*/}
          <Route path="/training" exact={true} element={<Training />} />
          <Route path="/news_reserch" exact={true} element={<News />} />
          <Route path="/resource" exact={true} element={<Resource />} />
          <Route path="/tboard" exact={true} element={<Tboard />} />

          {/*Admin*/}
          <Route path="/admin/login" exact={true} element={<AdminLogin />} />
          <Route path="/admin/devices" exact={true} element={<DeviceList />} />
          <Route path="/admin/add/device" exact={true} element={<AddDevice />} />
          {/*<Route
            path="/admin/add/device"
            exact={true}
            element={<AddMACForm />}
          />*/}

          {/*ContactUs*/}
          <Route path="/contactus" exact={true} element={<ContactUs />} />

          {/*DataLiteracy */}
          <Route path="/dataLiteracy">
            <Route path="drawGraph" element={<DrawGraph />} />
            <Route path="graphInterpreter" element={<GraphInterpreterPage />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
