import * as Styled from '../CustomTable/Styled';
import { useGraphDataStore } from '../../store/graphStore';
import { useState } from 'react';
import useComponentPosition from '../../hooks/useComponentPosition';
import bar from './../../images/bar.png';
import line from './../../images/line.png';
import combo from './../../images/combo.png';
import doughnut from './../../images/doughnut.png';
import scatter from './../../images/scatter.png';

function ExpertCustomGraphHeader() {
  const { graphIdx, changeGraphIndex } = useGraphDataStore();
  const { ref } = useComponentPosition();
  const [selectedGraphType, setSelectedGraphType] = useState(0);

  console.log(graphIdx);
  return (
    <div>
      <Styled.TableHeaderWrapper ref={ref}></Styled.TableHeaderWrapper>
      <div className="flex justify-left my-4 ml-4">
        <div className="flex gap-2 p-2 rounded-xl border-2 border-gray-200 bg-white bg-opacity-50 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          <button
            type="button"
            className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${
              selectedGraphType === 0
                ? 'bg-blue-500/20 border border-blue-400'
                : 'bg-white border border-gray-300 hover:border-gray-400'
            } hover:shadow-md`}
            onClick={() => {
              setSelectedGraphType(0);
              changeGraphIndex(0);
            }}
          >
            <img src={bar} alt="bar graph" className="w-8 h-8" />
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${
              selectedGraphType === 1
                ? 'bg-blue-500/20 border border-blue-400'
                : 'bg-white border border-gray-300 hover:border-gray-400'
            } hover:shadow-md`}
            onClick={() => {
              setSelectedGraphType(1);
              changeGraphIndex(1);
            }}
          >
            <img src={line} alt="line graph" className="w-8 h-8" />
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${
              selectedGraphType === 2
                ? 'bg-blue-500/20 border border-blue-400'
                : 'bg-white border border-gray-300 hover:border-gray-400'
            } hover:shadow-md`}
            onClick={() => {
              setSelectedGraphType(2);
              changeGraphIndex(2);
            }}
          >
            <img src={combo} alt="combo graph" className="w-8 h-8" />
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${
              selectedGraphType === 3
                ? 'bg-blue-500/20 border border-blue-400'
                : 'bg-white border border-gray-300 hover:border-gray-400'
            } hover:shadow-md`}
            onClick={() => {
              setSelectedGraphType(3);
              changeGraphIndex(3);
            }}
          >
            <img src={doughnut} alt="doughnut graph" className="w-8 h-8" />
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${
              selectedGraphType === 4
                ? 'bg-blue-500/20 border border-blue-400'
                : 'bg-white border border-gray-300 hover:border-gray-400'
            } hover:shadow-md`}
            onClick={() => {
              setSelectedGraphType(4);
              changeGraphIndex(4);
            }}
          >
            <img src={scatter} alt="scatter graph" className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpertCustomGraphHeader;
