import { Button } from "react-bootstrap";
import "./Table.scss";
import classNames from "classnames";
import { useGraphDataStore } from "../../../Study/store/graphStore";
import { useTabStore } from "../../../Study/store/tabStore";

function TableForAssignment({ data }) {
  const changeTab = useTabStore(state => state.changeTab);
  const setData = useGraphDataStore(state => state.setData);

  const onClickBtn = () => {
    setData(data);
    changeTab("table");
  };

  return (
    <div style={{ textAlign: "center" }}>
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
                  even: row % 2 === 0,
                }
              )}
              key={`${row} ${col}`}
            >
              <input type="text" value={data[row][col]} disabled />
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
