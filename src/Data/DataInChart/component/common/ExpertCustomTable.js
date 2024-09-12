import { useGraphDataStore } from "../../store/graphStore";
import { useState } from "react";
import Overlay from "../../../../DataLiteracy/common/Overlay/Overlay";
import { useTabStore } from "../../store/tabStore";
import useComponentPosition from "../../../../DataLiteracy/hooks/useComponentPosition";
import { usetutorialStroe } from "../../../../DataLiteracy/store/tutorialStore";
import Portal from "../../../../Portal";
import TutorialDescription from "../../../../DataLiteracy/common/TutorialDescription/TutorialDescription";

function ExpertCustomTable() {
  const { data, changeValue, changeVariableType, title } = useGraphDataStore();
  const [editableCell, setEditableCell] = useState(null);
  const { ref, position } = useComponentPosition();
  const { changeTab } = useTabStore();
  const { isTutorial, step, type } = usetutorialStroe();
  const tableNumberData = data.map((d, idx) => {
    if (idx == 0) return "Rows#";
    return `${idx}`;
  });

  const headers = data[0];

  const onClickPencil = () => {};

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
      <table
        className="w-full border-solid border-[1px] border-[rgba(34, 36, 38, 0.15)] rounded-xl caption-top border-collapse"
        ref={ref}
      >
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

        {isTutorial && step === 5 && type !== "mix" && (
          <Portal>
            <TutorialDescription
              position="bottom"
              top={position.top - 260}
              left={position.left + 730}
              width={"500px"}
              prevButtonClick={() => {
                changeTab();
              }}
              nextButtonClick={() => {
                changeTab();
              }}
            />
            <Overlay position={position} />
          </Portal>
        )}
        {isTutorial && step === 6 && type === "mix" && (
          <Portal>
            <TutorialDescription
              position="bottom"
              top={position.top - 270}
              left={position.left + 730}
              width={"500px"}
              prevButtonClick={() => {
                changeTab();
              }}
              nextButtonClick={() => {
                changeTab();
              }}
            />
            <Overlay position={position} />
          </Portal>
        )}
      </table>
    </div>
  );
}

export default ExpertCustomTable;
