import "./leftSlidePage.scss";
import Header from "../component/Header/Header";
import MyDataButton from "./MyDataButton";
import { useEffect, useState } from "react";
import ExpertDataButton from "./ExpertDataButton";

export default function LeftSlidePage(props) {
  // 최상위 버튼 설정 초기 My Data로 설정함
  const [buttonCheck, setButtonCheck] = useState("MyData");

  useEffect(() => {
    console.log("왼쪽 메뉴바 버튼 체크 : " + buttonCheck);
    props.setButton(buttonCheck);
  }, [buttonCheck]);

  return (
    <div className="e-class-mydata">
      <Header />
      <div className="myData-left">
        <div className="myData-summary">
          <MyDataButton buttonName={"Data"} setButtonCheck={setButtonCheck} />
          <ExpertDataButton
            buttonName={"ExpertData"}
            setButtonCheck={setButtonCheck}
          />
          <MyDataButton buttonName={"Assignmnet"} />
          <MyDataButton buttonName={"Submitted"} />
        </div>
      </div>
    </div>
  );
}
