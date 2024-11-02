import React from 'react';

function AirPlaceList({ airDataList }) {
  return (
    <div
      style={{
        width: '1400px',
        margin: '2rem auto',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ overflowX: 'auto' }}>
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
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #D1D5DB',
                  textAlign: 'center',
                }}
              >
                측정 장소
              </th>
              <th
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #D1D5DB',
                  textAlign: 'center',
                }}
              >
                측정 일
              </th>
              <th
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #D1D5DB',
                  textAlign: 'center',
                }}
              >
                이산화질소 농도(ppm)
              </th>
              <th
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #D1D5DB',
                  textAlign: 'center',
                }}
              >
                오존 농도(ppm)
              </th>
              <th
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #D1D5DB',
                  textAlign: 'center',
                }}
              >
                미세먼지(PM10) 농도(㎍/㎥)
              </th>
              <th
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #D1D5DB',
                  textAlign: 'center',
                }}
              >
                미세먼지(PM2.5) 농도(㎍/㎥)
              </th>
              <th
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #D1D5DB',
                  textAlign: 'center',
                }}
              >
                아황산가스 농도(ppm)
              </th>
            </tr>
          </thead>
          <tbody>
            {airDataList.map((item, index) => (
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
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                  }}
                >
                  {item.stationName}
                </td>
                <td
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                  }}
                >
                  {item.date}
                </td>
                <td
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                  }}
                >
                  {item.no2}
                </td>
                <td
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                  }}
                >
                  {item.o3}
                </td>
                <td
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                  }}
                >
                  {item.pm10}
                </td>
                <td
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                  }}
                >
                  {item.pm25}
                </td>
                <td
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                  }}
                >
                  {item.so2Value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AirPlaceList;
