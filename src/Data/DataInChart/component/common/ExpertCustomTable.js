import { useGraphDataStore } from "../../store/graphStore";
import { useState } from "react";
import { useTabStore } from "../../store/tabStore";
import useComponentPosition from "../../hooks/useComponentPosition";

function ExpertCustomTable() {
  const { data, changeValue, changeVariableType, title } = useGraphDataStore();
  const [editableCell, setEditableCell] = useState(null);

  const headers = data[0];

  const onChangeType = (index, type) => {
    changeVariableType(index, type);
  };

  const onDoubleClickData = (row, col) => {
    console.log(row, col);
    setEditableCell({ row, col });
  };

  const handleInputChange = (e, row, col) => {
    const newValue = e.target.value;
    changeValue(row, col, newValue);
  };

  const onClickEnter = ({ key, isComposing }) => {
    if (isComposing) {
      return;
    }

    if (key !== "Enter") {
      return;
    }

    setEditableCell(null);
  };

  return (
    <div>
      <table className="w-full border-solid border-[1px] border-[rgba(34, 36, 38, 0.15)] rounded-xl caption-top border-collapse">
        <caption className="text-2xl font-semibold py-2 text-center text-black">
          {title}
        </caption>
        <thead>
          <tr>
            {["", ...headers].map((header, headerIndex) => {
              return (
                <th
                  className="border-[1px] border-[rgba(34, 36, 38, 0.15)]  shadow-[0_8px_5px_-5px_rgba(0,0,0,0.3)] z-30 leading-[20px] py-3 px-2 text-center"
                  key={headerIndex}
                >
                  <span className="text-xl">{header}</span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.slice(1).map((row, rowIndex) => (
            <tr>
              {[rowIndex, ...row].map((value, valueIndex) => {
                return (
                  <td className="border-[1px] border-[rgba(34, 36, 38, 0.15)] text-center py-2">
                    <span className="text-md">{value}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpertCustomTable;
