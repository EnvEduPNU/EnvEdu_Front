import { Button } from "react-bootstrap";
import "./Table.scss";
import classNames from "classnames";
import { useGraphDataStore } from "../../../Study/store/graphStore";
import { useTabStore } from "../../../Study/store/tabStore";
import { useEffect, useState } from "react";
import useEClassAssignmentStore from "../../store/eClassAssignmentStore";

function TableForAssignment({ data, pageIndex, activityIndex }) {
  const [tableData, setTableData] = useState(data);
  const changeTab = useTabStore(state => state.changeTab);
  const setData = useGraphDataStore(state => state.setData);
  const changeEclassDataFieldValue = useEClassAssignmentStore(
    state => state.changeEclassDataFieldValue
  );

  const onClickBtn = () => {
    setData(tableData);
    changeTab("table");
  };

  useEffect(() => {
    return () =>
      changeEclassDataFieldValue(pageIndex, activityIndex, "data", tableData);
  }, [tableData]);

  const handleInputChange = (rowIdx, colIdx, value) => {
    const newData = tableData.map(v => [...v]);
    newData[rowIdx][colIdx] = value;
    setTableData(newData);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div
        className="newDataInput-table"
        style={{ gridTemplateColumns: `repeat(${tableData[0].length}, 1fr)` }}
      >
        {tableData.map((tr, row) =>
          tr.map((key, col) => (
            <div
              className={classNames(
                "cell",
                { head: row === 0 },
                { body: row > 0 },
                {
                  even: row % 2 === 0,
                }
              )}
              key={`${row} ${col}`}
            >
              <input
                type="text"
                value={tableData[row][col]}
                onChange={e => handleInputChange(row, col, e.target.value)}
              />
            </div>
          ))
        )}
      </div>
      <Button
        variant="dark"
        style={{ marginTop: "0.5rem", textAlign: "center" }}
        onClick={onClickBtn}
      >
        해당 테이블로 데이터 불러오기
      </Button>
    </div>
  );
}

export default TableForAssignment;
