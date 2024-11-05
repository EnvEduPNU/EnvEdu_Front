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
  // const { ref } = useComponentPosition();

  return (
    <div>
      {/* <Styled.TableHeaderWrapper ref={ref}></Styled.TableHeaderWrapper> */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          margin: '1rem 0 1rem 1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.5rem',
            borderRadius: '0.75rem',
            border: '2px solid #E5E7EB',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <button
            type="button"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              transition: 'all 0.3s ease-in-out',
              backgroundColor:
                graphIdx === 0 ? 'rgba(59, 130, 246, 0.2)' : 'white',
              border:
                graphIdx === 0 ? '1px solid #60A5FA' : '1px solid #D1D5DB',
              boxShadow: graphIdx === 0 ? '0 4px 6px rgba(0, 0, 0, 0.1)' : '',
            }}
            onClick={() => {
              changeGraphIndex(0);
            }}
          >
            <img
              src={bar}
              alt="bar graph"
              style={{ width: '2rem', height: '2rem' }}
            />
          </button>
          <button
            type="button"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              transition: 'all 0.3s ease-in-out',
              backgroundColor:
                graphIdx === 1 ? 'rgba(59, 130, 246, 0.2)' : 'white',
              border:
                graphIdx === 1 ? '1px solid #60A5FA' : '1px solid #D1D5DB',
              boxShadow: graphIdx === 1 ? '0 4px 6px rgba(0, 0, 0, 0.1)' : '',
            }}
            onClick={() => {
              changeGraphIndex(1);
            }}
          >
            <img
              src={line}
              alt="line graph"
              style={{ width: '2rem', height: '2rem' }}
            />
          </button>
          <button
            type="button"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              transition: 'all 0.3s ease-in-out',
              backgroundColor:
                graphIdx === 2 ? 'rgba(59, 130, 246, 0.2)' : 'white',
              border:
                graphIdx === 2 ? '1px solid #60A5FA' : '1px solid #D1D5DB',
              boxShadow: graphIdx === 2 ? '0 4px 6px rgba(0, 0, 0, 0.1)' : '',
            }}
            onClick={() => {
              changeGraphIndex(2);
            }}
          >
            <img
              src={combo}
              alt="combo graph"
              style={{ width: '2rem', height: '2rem' }}
            />
          </button>
          <button
            type="button"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              transition: 'all 0.3s ease-in-out',
              backgroundColor:
                graphIdx === 3 ? 'rgba(59, 130, 246, 0.2)' : 'white',
              border:
                graphIdx === 3 ? '1px solid #60A5FA' : '1px solid #D1D5DB',
              boxShadow: graphIdx === 3 ? '0 4px 6px rgba(0, 0, 0, 0.1)' : '',
            }}
            onClick={() => {
              changeGraphIndex(3);
            }}
          >
            <img
              src={doughnut}
              alt="doughnut graph"
              style={{ width: '2rem', height: '2rem' }}
            />
          </button>
          <button
            type="button"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              transition: 'all 0.3s ease-in-out',
              backgroundColor:
                graphIdx === 4 ? 'rgba(59, 130, 246, 0.2)' : 'white',
              border:
                graphIdx === 4 ? '1px solid #60A5FA' : '1px solid #D1D5DB',
              boxShadow: graphIdx === 4 ? '0 4px 6px rgba(0, 0, 0, 0.1)' : '',
            }}
            onClick={() => {
              changeGraphIndex(4);
            }}
          >
            <img
              src={scatter}
              alt="scatter graph"
              style={{ width: '2rem', height: '2rem' }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpertCustomGraphHeader;
