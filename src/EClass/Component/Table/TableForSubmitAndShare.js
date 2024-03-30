import "./Table.scss";
import classNames from "classnames";

function TableForSubmitAndShare({ data }) {
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
    </div>
  );
}

export default TableForSubmitAndShare;
