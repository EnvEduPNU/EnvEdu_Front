import { useState } from "react";
import * as Styled from "./Styled";
import useComponentPosition from "../../../DataLiteracy/hooks/useComponentPosition";
import Portal from "../../../Portal";
import { Button } from "react-bootstrap";
import Table from "../\bTable/Table";

function TableTool({ setActivity }) {
  const { ref, position } = useComponentPosition();
  const [cell, setCell] = useState({ row: "", col: "" });
  const [visible, setVisible] = useState(false);

  const onClickTool = () => {
    setVisible(true);
  };

  const appendTable = e => {
    e.stopPropagation();
    setVisible(state => !state);
    setActivity(state => [...state, <Table row={+cell.row} col={+cell.col} />]);
  };

  return (
    <Styled.Tool ref={ref} onClick={onClickTool}>
      <svg
        height="20"
        viewBox="0 0 1792 1792"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M576 1376v-192q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v192q0 14 9 23t23 9h320q14 0 23-9t9-23zm0-384v-192q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v192q0 14 9 23t23 9h320q14 0 23-9t9-23zm512 384v-192q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v192q0 14 9 23t23 9h320q14 0 23-9t9-23zm-512-768v-192q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v192q0 14 9 23t23 9h320q14 0 23-9t9-23zm512 384v-192q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v192q0 14 9 23t23 9h320q14 0 23-9t9-23zm512 384v-192q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v192q0 14 9 23t23 9h320q14 0 23-9t9-23zm-512-768v-192q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v192q0 14 9 23t23 9h320q14 0 23-9t9-23zm512 384v-192q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v192q0 14 9 23t23 9h320q14 0 23-9t9-23zm0-384v-192q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v192q0 14 9 23t23 9h320q14 0 23-9t9-23zm128-320v1088q0 66-47 113t-113 47h-1344q-66 0-113-47t-47-113v-1088q0-66 47-113t113-47h1344q66 0 113 47t47 113z" />
      </svg>
      {visible && (
        <Portal>
          <Styled.Popup
            style={{
              left: position.left,
              top: position.top + 20,
            }}
          >
            <Styled.PopupTitle>행 열 입력</Styled.PopupTitle>
            <Styled.Block>
              <Styled.Button>열</Styled.Button>
              <Styled.Input
                value={cell.row}
                onChange={e =>
                  setCell(state => ({ ...state, row: e.target.value }))
                }
              />
            </Styled.Block>
            <Styled.Block>
              <Styled.Button>행</Styled.Button>
              <Styled.Input
                value={cell.col}
                onChange={e =>
                  setCell(state => ({ ...state, col: e.target.value }))
                }
              />
            </Styled.Block>
            <Styled.Block style={{ justifyContent: "flex-end" }}>
              <Button onClick={e => appendTable(e)}>확인</Button>
            </Styled.Block>
          </Styled.Popup>
        </Portal>
      )}
    </Styled.Tool>
  );
}

export default TableTool;
