import React from 'react';

function TableComponent({ places, searchStationName, setSearchStationName }) {
  return (
    <div
      style={{
        width: '1200px',
        margin: '1rem auto',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{ overflowX: 'auto', maxHeight: '300px', overflowY: 'scroll' }}
      >
        <table
          style={{
            minWidth: '100%',
            backgroundColor: '#ffffff',
            border: '1px solid #D1D5DB',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: '#E5E7EB',
                color: '#374151',
                fontWeight: '600',
              }}
            >
              <th
                style={{
                  minWidth: '80px',
                  maxWidth: '80px',
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #D1D5DB',
                  textAlign: 'center',
                }}
              >
                선택
              </th>
              <th
                style={{
                  minWidth: '200px',
                  maxWidth: '200px',
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #D1D5DB',
                  textAlign: 'center',
                }}
              >
                측정소명
              </th>
              <th
                style={{
                  minWidth: '700px',
                  maxWidth: '700px',
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #D1D5DB',
                  textAlign: 'center',
                }}
              >
                측정소 주소
              </th>
            </tr>
          </thead>
          <tbody>
            {places.map((place, index) => (
              <tr
                key={index}
                style={{
                  textAlign: 'center',
                  backgroundColor: index % 2 === 0 ? '#F9FAFB' : '#FFFFFF',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#F3F4F6')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    index % 2 === 0 ? '#F9FAFB' : '#FFFFFF')
                }
              >
                <td
                  style={{
                    minWidth: '80px',
                    maxWidth: '80px',
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={place.stationName === searchStationName}
                    onChange={() => {
                      setSearchStationName(place.stationName);
                    }}
                  />
                </td>
                <td
                  style={{
                    minWidth: '200px',
                    maxWidth: '200px',
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                  }}
                >
                  {place.stationName}
                </td>
                <td
                  style={{
                    minWidth: '700px',
                    maxWidth: '700px',
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                  }}
                >
                  {place.addr}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableComponent;
