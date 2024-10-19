import React from 'react';

const CombinedFilter = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  dataLabels,
  selectedLabel,
  setSelectedLabel,
  applyFilter,
}) => {
  return (
    <div
      style={{
        marginBottom: '20px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>
          데이터 종류:
          <select
            value={selectedLabel}
            onChange={(e) => setSelectedLabel(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="">전체</option>
            {dataLabels.map((label, index) => (
              <option key={index} value={label}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* 필터 적용 버튼 */}
      <button
        onClick={applyFilter}
        style={{
          marginLeft: '10px',
          padding: '5px 10px',
          cursor: 'pointer',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        적용
      </button>
    </div>
  );
};

export default CombinedFilter;
