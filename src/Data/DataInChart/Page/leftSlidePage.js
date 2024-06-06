import "./leftSlidePage.scss";
import Header from "../component/Header/Header";
import MyDataList from "./MyDataList";
import MyDataButton from "./MyDataButton";
import { useEffect, useState } from "react";
import ExpertDataButton from "./ExpertDataButton";

export default function LeftSlidePage() {
  return (
    <div className="e-class-mydata">
      <Header />
      <div className="myData-left">
        <div className="myData-summary">
          <MyDataButton buttonName={"Data"} />
          <ExpertDataButton buttonName={"Expert Data"} />
          <MyDataButton buttonName={"Assignmnet"} />
          <MyDataButton buttonName={"Submitted"} />
        </div>
      </div>
    </div>
  );
}
