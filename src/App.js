import React, { useEffect } from "react";

import "./App.css";
import { Routes, Route } from "react-router-dom";
import RegisterForm from "./User/Register/RegisterForm";
import Home from "./Homepage/Home";
import AddMACForm from "./Admin/Device/AddMACForm";
import AddDevice from "./Admin/Device/addDevice";
import LoginForm from "./User/Login/LoginForm";
import Header from "./Header/Header";
import RegisterStudents from "./User/Educator/RegisterStudents";
import Footer from "./Footer/Footer";
import Find from "./User/Find/Find";
import Notice from "./Contact/Announcement/Notice";
import Board from "./Contact/Board/Board";
import Team from "./About/Team/Team";
import What from "./About/What/What";
import News from "./Learnmore/News/News";
import Research from "./Learnmore/Research/Research";
import Training from "./Learnmore/Training/Training";
import Training1 from "./Learnmore/Training/Training1";
import Training2 from "./Learnmore/Training/Training2";
import Training3 from "./Learnmore/Training/Training3";
import Implementation from "./Learnmore/Implementation/Implementation";
import EmailAuth from "./User/Register/EmailAuth";
import AdminLogin from "./Admin/Login/AdminLogin";
import DeviceList from "./Admin/Device/DeviceList";
import ContactUs from "./Contact/ContactUs/ContactUs";
import EducationResources from "./Education/EducationResources/Resource";
import OpenApi from "./Data/OpenAPIData/OpenApi";
import OpenApiPast from "./Data/OpenAPIData/openAPIPast";
import Search from "./Data/OpenAPIData/search";
import MyData from "./Data/MyData/myData";
import ReadExcel from "./Data/MyData/readExcel";
import SEEdAppMain from "./Data/SEEdApp/SEEdAppMain";
import DataPretreatmentPage from "./DataLiteracy/DataPretreatment/DataPretreatmentPage";
import DataInputPage from "./DataLiteracy/DataInput/DataInputPage";
import NewDataInput from "./DataLiteracy/DataInput/NewDataInput";
import DrawGraphV2Page from "./DataLiteracy/DrawGraph/page/DrawGraphV2Page";
import DataLoadPage from "./DataLiteracy/DataLoad/page/DataLoadPage";
import GraphEvalutionRusult from "./DataLiteracy/DrawGraph/GraphEvalutionRusult/GraphEvalutionRusult";
import ResultReport from "./DataLiteracy/DrawGraph/ResultReport/ResultReport";

import DataClass from "./DataClass/DataClass";
import CheckReadData from "./DataClass/ReadData/CheckData";
import CheckManipulateData from "./DataClass/ManipulateData/CheckData";
import CheckAnalyzeData from "./DataClass/AnalyzeData/CheckData";
import CheckCompareData from "./DataClass/CompareData/CheckData";
import SlidePage from "./Study/Page/SlidePage";

import Invite from "./Education/Invite";
import EClassList from "./DataClass";
import CreateEClassPage from "./Study/Page/CreateEClassPage";
import TextbookPage from "./Data/DataInTextbooks/page/TextbookPage";
import TextbookDetailPage from "./Data/DataInTextbooks/page/TextbookDetailPage/TextbookDetailPage";
import DataInChartPage from "./Data/DataInChart/Page/DataInChartPage";

import Survey from "./Education/Survey/Survey";
import CreateSurvey from "./Education/Survey/Admin/CreateSurvey";
import UploadReward from "./Education/Survey/Admin/UploadReward";
import ViewReward from "./Education/Survey/Respondent/ViewReward";
import ViewResponse from "./Education/Survey/Admin/ViewResponse";

import { useNavigate } from "react-router-dom";
import EClassLivePage from "./EClass/Page/EClassPage/EClassLivePage";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const expiredAt = localStorage.getItem("expiredAt");

    if (expiredAt) {
      const currentTime = new Date();
      const expiredAtTime = new Date(expiredAt);

      // 1일이 더 지났다면 다시 로그인 해야 됨
      if (expiredAtTime < currentTime) {
        console.log("유효기간 만료 : ", expiredAtTime);
        localStorage.clear();
        navigate("/");
        window.location.reload();
      } else {
        console.log("유효기간 : " + expiredAtTime);
      }
    } else {
      alert("로그인이 필요합니다.");
    }
  }, []);

  return (
    <>
      <Header />

      <div className="wrap">
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
          {/*ABOUT*/}
          <Route path="/what" exact={true} element={<What />} />{" "}
          {/*What We Do*/}
          <Route path="/team" exact={true} element={<Team />} /> {/*Team*/}
          {/*GET STARTED*/}
          {/*DATA*/}
          <Route path="/socket" exact={true} element={<SEEdAppMain />} />{" "}
          {/*SEEd App*/}
          <Route path="/myData" exact={true} element={<MyData />} />{" "}
          {/*My Data*/}
          <Route path="/readExcel" exact={true} element={<ReadExcel />} />
          <Route path="/search" exact={true} element={<Search />} />
          <Route
            path="/data-in-chart"
            exact={true}
            element={<DataInChartPage />}
          />{" "}
          {/*Data & Chart*/}
          <Route path="/openAPI" exact={true} element={<OpenApi />} />{" "}
          {/*OPEN API*/}
          <Route path="/openAPI/past" exact={true} element={<OpenApiPast />} />
          <Route
            path="/textbook"
            exact={true}
            element={<TextbookPage />}
          />{" "}
          {/*Data In Textbooks*/}
          <Route
            path="/textbook/detail"
            exact={true}
            element={<TextbookDetailPage />}
          />
          {/*EDUCATION*/}
          <Route path="/invite" exact={true} element={<Invite />} />
          <Route path="/dataclass" exact={true} element={<DataClass />} />
          <Route
            path="/checkReadData"
            exact={true}
            element={<CheckReadData />}
          />
          <Route
            path="/checkManipulateData"
            exact={true}
            element={<CheckManipulateData />}
          />
          <Route
            path="/checkAnalyzeData"
            exact={true}
            element={<CheckAnalyzeData />}
          />
          <Route
            path="/checkCompareData"
            exact={true}
            element={<CheckCompareData />}
          />
          <Route path="/dataclass" exact={true} element={<DataClass />} />
          <Route
            path="/checkReadData"
            exact={true}
            element={<CheckReadData />}
          />
          <Route
            path="/checkManipulateData"
            exact={true}
            element={<CheckManipulateData />}
          />
          <Route
            path="/checkAnalyzeData"
            exact={true}
            element={<CheckAnalyzeData />}
          />
          <Route
            path="/checkCompareData"
            exact={true}
            element={<CheckCompareData />}
          />
          {/* <Route path="/E-Classes">

            <Route path="" exact={true} element={<EClassList />} />
            <Route path="new" exact={true} element={<CreateEClassPage />} />
          </Route> */}
          <Route path="/E-Classes">
            {" "}
            {/*E-Class*/}
            <Route path="" exact={true} element={<EClassLivePage />} />
          </Route>
          <Route path="/slide/:id" exact={true} element={<SlidePage />} />
          <Route path="/dataLiteracy">
            {" "}
            {/*DataLiteracy */}
            <Route path="drawGraph" element={<DrawGraphV2Page />} />
            <Route path="graphInterpreter" element={<GraphEvalutionRusult />} />
            <Route path="result" element={<ResultReport />} />
            <Route path="pretreatment" element={<DataPretreatmentPage />} />
            <Route path="dataInput">
              <Route path="" element={<DataInputPage />} />
              <Route path="new" element={<NewDataInput />} />
            </Route>
            <Route path="dataload" element={<DataLoadPage />} />
            <Route path="ex" element={<DrawGraphV2Page />} />
          </Route>
          <Route
            path="/resource"
            exact={true}
            element={<EducationResources />}
          />{" "}
          {/*Education Resources*/}
          <Route path="/survey" exact={true} element={<Survey />} />{" "}
          {/*Survey*/}
          <Route
            path="/create-survey"
            exact={true}
            element={<CreateSurvey />}
          />
          <Route
            path="/view-response/:inviteCode"
            exact={true}
            element={<ViewResponse />}
          />
          <Route
            path="/upload-reward"
            exact={true}
            element={<UploadReward />}
          />
          <Route path="/view-reward" exact={true} element={<ViewReward />} />
          {/*LEARN MORE*/}
          <Route path="/news" exact={true} element={<News />} />
          <Route path="/research" exact={true} element={<Research />} />
          <Route path="/training" exact={true} element={<Training />} />
          <Route path="/training1" exact={true} element={<Training1 />} />
          <Route path="/training2" exact={true} element={<Training2 />} />
          <Route path="/training3" exact={true} element={<Training3 />} />
          <Route
            path="/implementation"
            exact={true}
            element={<Implementation />}
          />
          {/*CONTACT*/}
          <Route path="/contact" exact={true} element={<ContactUs />} />{" "}
          {/*Contact us*/}
          <Route path="/notice" exact={true} element={<Notice />} />{" "}
          {/*Announcement*/}
          <Route path="/board" exact={true} element={<Board />} /> {/*Board*/}
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;
