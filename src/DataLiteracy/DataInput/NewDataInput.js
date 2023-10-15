import * as XLSX from "xlsx";
import { Button } from "react-bootstrap";
import SideBar from "../common/SideBar/SideBar";
import classNames from "classnames";
import "./DataInput.scss";
import { useRef, useState } from "react";

function NewDataInput() {
  const [type, setType] = useState("manual");
  const [data, setData] = useState(
    Array(5)
      .fill(0)
      .map(row => Array(5).fill(""))
  );
  const inputFileRef = useRef(null);

  const readExcel = file => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = e => {
      const bufferArray = e.target.result;
      const workbook = XLSX.read(bufferArray, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setData(data);
    };
  };

  const handleExcelFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      readExcel(file);
    }
  };
  const onClickButton = type => {
    setType(type);
    if (type == "excel") {
      inputFileRef.current.click();
    }
  };
  const handleInputChange = (rowIdx, colIdx, value) => {
    const newData = data.map(v => [...v]);
    newData[rowIdx][colIdx] = value;
    setData(newData);
  };

  const onClickRowAddBtn = () => {
    const newRow = Array(data[0].length).fill("");
    setData(prevData => [...prevData.map(v => [...v]), newRow]);
  };

  const onClickColAddBtn = () => {
    //열 추가 버튼
    const newData = data.map(row => [...row, ""]);
    setData(newData);
  };

  return (
    <div className="newDataInput">
      <SideBar activeIdx={0} />
      <div>
        <div className="newDataInput-header">
          <Button
            className={classNames("newDataInput-button", {
              click: type === "manual",
            })}
            onClick={() => onClickButton("manual")}
          >
            Manual
          </Button>
          <Button
            className={classNames("newDataInput-button", {
              click: type === "excel",
            })}
            onClick={() => onClickButton("excel")}
          >
            엑셀 파일로 불러오기
            <input
              type="file"
              accept=".xlsx"
              onChange={handleExcelFileChange}
              ref={inputFileRef}
              style={{ visibility: "hidden", position: "absolute" }} // input을 숨깁니다.
            />
          </Button>
          <Button
            className={classNames("newDataInput-button", {
              click: type === "seed",
            })}
            onClick={() => onClickButton("seed")}
          >
            Seed 데이터 불러오기
          </Button>
          <Button
            className={classNames("newDataInput-button", {
              click: type === "openApi",
            })}
            onClick={() => onClickButton("openApi")}
          >
            공공 데이터 불러오기
          </Button>
        </div>
        <div
          className="newDataInput-table"
          style={{ gridTemplateColumns: `repeat(${data[0].length}, 1fr)` }}
        >
          {data.map((tr, row) =>
            tr.map((key, col) => (
              <div
                className={classNames(
                  "cell",
                  { head: row === 0 },
                  { body: row > 0 },
                  {
                    even: row % 2 == 0,
                  }
                )}
                key={`${row} ${col}`}
              >
                <input
                  type="text"
                  value={data[row][col]}
                  onChange={e => handleInputChange(row, col, e.target.value)}
                />
              </div>
            ))
          )}
        </div>
        <div className="newDataInput-buttonWrapper">
          <Button onClick={onClickColAddBtn}>열 추가하기</Button>
          <Button onClick={onClickRowAddBtn}>행 추가하기</Button>
        </div>
      </div>
    </div>
  );
}

export default NewDataInput;
