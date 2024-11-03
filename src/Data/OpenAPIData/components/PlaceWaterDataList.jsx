import React from 'react';

function PlaceWaterDataList({ waterlistData }) {
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
                회차
              </th>
              <th
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #D1D5DB',
                  textAlign: 'center',
                }}
              >
                수심(m)
              </th>
              <th
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #D1D5DB',
                  textAlign: 'center',
                }}
              >
                수온(°C)
              </th>
              <th
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #D1D5DB',
                  textAlign: 'center',
                }}
              >
                DO(㎎/L)
              </th>
              <th
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #D1D5DB',
                  textAlign: 'center',
                }}
              >
                BOD(㎎/L)
              </th>
              <th
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #D1D5DB',
                  textAlign: 'center',
                }}
              >
                COD(㎎/L)
              </th>
              <th
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #D1D5DB',
                  textAlign: 'center',
                }}
              >
                SS(㎎/L)
              </th>
              <th
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #D1D5DB',
                  textAlign: 'center',
                }}
              >
                TN(㎎/L)
              </th>
              <th
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #D1D5DB',
                  textAlign: 'center',
                }}
              >
                TP(㎎/L)
              </th>
              <th
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #D1D5DB',
                  textAlign: 'center',
                }}
              >
                TOC(㎎/L)
              </th>
            </tr>
          </thead>
          <tbody>
            {waterlistData.map((item, index) => (
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
                  {item.ptnm}
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
                  {item.wmwk}
                </td>
                <td
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                  }}
                >
                  {item.wmdep}
                </td>
                <td
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                  }}
                >
                  {item.temp}
                </td>
                <td
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                  }}
                >
                  {item.do}
                </td>
                <td
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                  }}
                >
                  {item.bod}
                </td>
                <td
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                  }}
                >
                  {item.cod}
                </td>
                <td
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                  }}
                >
                  {item.ss}
                </td>
                <td
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                  }}
                >
                  {item.tn}
                </td>
                <td
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                  }}
                >
                  {item.tp}
                </td>
                <td
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                  }}
                >
                  {item.toc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PlaceWaterDataList;
