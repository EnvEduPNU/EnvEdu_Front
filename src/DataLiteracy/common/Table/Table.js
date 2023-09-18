import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import "./Table.scss";

const Table = ({
  head,
  body,
  isShowCheckBox = false,
  changeSelected,
  seleted,
}) => {
  return (
    <table className="table">
      <thead>
        <tr>
          {head.map((key, idx) =>
            !isShowCheckBox ? (
              <th key={key}>{key}</th>
            ) : (
              <th key={key}>
                <span>{key}</span>
                <FormCheckInput
                  className="checkBox"
                  checked={seleted?.includes(idx)}
                  onChange={() => changeSelected(idx)}
                />
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody>
        {body.map((d, idx) => (
          <tr key={idx}>
            {d.map(key => (
              <td key={key}>{key}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
