import { Button } from "react-bootstrap";
import SideBar from "../common/SideBar/SideBar";
import "./DataInput.scss";
import classNames from "classnames";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DataInputPage() {
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const onClickButton = type => {
    setType(type);
  };
  const onClickNextBtn = () => {
    if (type === "new") navigate("new");
  };
  return (
    <div className="dataInputPage">
      <SideBar activeIdx={1} />
      <div>
        <div>
          <Button
            className={classNames("dataInputPage-button", {
              click: type === "new",
            })}
            onClick={() => onClickButton("new")}
          >
            New
          </Button>
          <Button
            className={classNames("dataInputPage-button", {
              click: type === "sample",
            })}
            onClick={() => onClickButton("sample")}
          >
            Sample
          </Button>
        </div>
        {type.length > 0 && (
          <div className="dataInputPage-nextBtn">
            <Button onClick={onClickNextBtn}>다음</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DataInputPage;
