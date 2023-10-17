import { useState } from "react";
import { Button } from "react-bootstrap";

function CellSelectModal({ setData, setIsVisibleModal }) {
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const onClickBtn = () => {
    setData(
      Array(row)
        .fill(0)
        .map(row => Array(col).fill(""))
    );
    setIsVisibleModal(state => !state);
  };
  return (
    <>
      <div
        onClick={() => setIsVisibleModal(state => !state)}
        className="overlay"
      ></div>
      <div className="cell-selection-modal">
        <div className="block">
          <div className="header">행 열 선택</div>
          <div className="cell-selection-modal_body">
            <div className="cell-selection-modal_input">
              <span>행: </span>
              <input
                type="number"
                value={row}
                onChange={e => setRow(+e.target.value)}
              />
            </div>
            <div className="cell-selection-modal_input">
              <span>열: </span>
              <input
                type="number"
                value={col}
                onChange={e => setCol(+e.target.value)}
              />
            </div>
            <Button onClick={onClickBtn}>확인</Button>
          </div>
        </div>
      </div>
      ;
    </>
  );
}

export default CellSelectModal;
