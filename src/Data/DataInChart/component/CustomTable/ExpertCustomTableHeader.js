import * as Styled from "./Styled";
import { useGraphDataStore } from "../../store/graphStore";
import useComponentPosition from "../../hooks/useComponentPosition";
import bar from "./../../images/bar.png";
import line from "./../../images/line.png";
import combo from "./../../images/combo.png";
import doughnut from "./../../images/doughnut.png";
import scatter from "./../../images/scatter.png";

function ExpertCustomTableHeader() {
  const { ref } = useComponentPosition();

  return (
    <div>
      <Styled.TableHeaderWrapper ref={ref}></Styled.TableHeaderWrapper>
      <div className="flex justify-start mt-2">
        <button
          type="button"
          className="bg-[#f8f8f8] border-[2.5px] border-black border-solid px-[40px]"
        >
          <img
            src={bar}
            alt="bar graph"
            className="w-[50px] h-[40px] bg-white"
          />
        </button>
        <button
          type="button"
          className="bg-[#f8f8f8] border-[2.5px] border-l-0 border-black border-solid px-[40px]"
        >
          <img
            src={line}
            alt="bar graph"
            className="w-[50px] h-[40px] bg-white"
          />
        </button>
        <button
          type="button"
          className="bg-[#f8f8f8] border-[2.5px] border-l-0 border-black border-solid px-[40px]"
        >
          <img
            src={combo}
            alt="combo graph"
            className="w-[50px] h-[40px] bg-white"
          />
        </button>
        <button
          type="button"
          className="bg-[#f8f8f8] border-[2.5px] border-l-0 border-black border-solid px-[40px]"
        >
          <img
            src={doughnut}
            alt="doughnut graph"
            className="w-[50px] h-[40px] bg-white"
          />
        </button>
        <button
          type="button"
          className="bg-[#f8f8f8] border-[2.5px] border-l-0 border-black border-solid px-[40px]"
        >
          <img
            src={scatter}
            alt="scatter graph"
            className="w-[50px] h-[40px] bg-white"
          />
        </button>
      </div>
    </div>
  );
}

export default ExpertCustomTableHeader;
