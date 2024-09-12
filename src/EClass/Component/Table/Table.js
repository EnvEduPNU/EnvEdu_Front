import { useState } from "react";
import classNames from "classnames";
import "./Table.scss";

const Table = ({ row, col, tableData }) => {
  const [data, setData] = useState(
    Array(row)
      .fill(0)
      .map(_ => Array(col).fill(""))
  );

  useState(() => {
    if (tableData) {
      setData(tableData);
    }
  }, []);

  const handleInputChange = (rowIdx, colIdx, value) => {
    const newData = data.map(v => [...v]);
    newData[rowIdx][colIdx] = value;
    setData(newData);
  };
  return (
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
            <input
              type="text"
              value={data[row][col]}
              onChange={e => handleInputChange(row, col, e.target.value)}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Table;
