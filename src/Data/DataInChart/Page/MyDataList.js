import { useState, useEffect } from 'react';
import { customAxios } from '../../../Common/CustomAxios';
import './leftSlidePage.scss';
import ForderListModal from '../modal/ForderListModal';

// DATA 드롭다운 리스트
export default function MyDataList({
  filteredData,
  setFilteredData,
  summary,
  setSummary,
}) {
  const [modalOpen, setModalOpen] = useState(false);

  // 가장 최초 테이블 요청
  useEffect(() => {
    customAxios
      .get('/mydata/list')
      .then((res) => {
        const formattedData = res.data.map((data) => ({
          ...data,
          saveDate: data.saveDate.split('T')[0],
          dataLabel:
            data.dataLabel === 'AIRQUALITY'
              ? '대기질 데이터'
              : data.dataLabel === 'OCEANQUALITY'
              ? '수질 데이터'
              : data.dataLabel,
        }));
        setSummary(formattedData);
      })
      .catch((err) => console.log(err));

    customAxios.get('/api/custom/list').then((res) => {
      const formattedData = res.data.map((table) => ({
        saveDate: table.saveDate.split('T')[0],
        dataLabel: 'CUSTOM',
        dataUUID: table.dataUUID,
        memo: table.memo,
      }));
      setSummary((prev) => [...prev, ...formattedData]);
    });
  }, []);

  const selectFolder = (type) => {
    let filtered = [];
    if (type === '전체') {
      filtered = summary;
      summary.unshift({ total: '전체' });
    } else if (type === '대기질') {
      filtered = summary.filter((data) => data.dataLabel === '대기질 데이터');
    } else if (type === '수질') {
      filtered = summary.filter((data) => data.dataLabel === '수질 데이터');
    } else if (type === 'SEED') {
      filtered = summary.filter((data) => data.dataLabel === 'SEED');
    } else if (type === 'CUSTOM') {
      filtered = summary.filter((data) => data.dataLabel === 'CUSTOM');
    }

    if (filtered.length === 0) {
      filtered.unshift({ none: type });
      setFilteredData(filtered);
      setModalOpen(true);
      console.log('데이터 없음');
    } else {
      setFilteredData(filtered);
      setModalOpen(true);
      console.log('데이터리스트에서 모달 true');
    }
  };

  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const handleFolderSelect = (folderId) => {
    setSelectedFolderId(folderId);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ height: '25vh', width: '20vh' }}>
        <div style={{ marginTop: '1rem' }} className="flex">
          <img
            src="/assets/img/folder-icon.png"
            style={{ width: '1.5rem', margin: '0 0.5rem' }}
          />
          <label
            onClick={() => selectFolder('전체')}
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            전체
          </label>
        </div>

        <div style={{ marginTop: '0.5rem' }} className="flex">
          <img
            src="/assets/img/folder-icon.png"
            style={{ width: '1.5rem', margin: '0 0.5rem' }}
          />
          <label
            onClick={() => selectFolder('대기질')}
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            대기질
          </label>
        </div>

        <div style={{ marginTop: '0.5rem', display: 'flex' }}>
          <img
            src="/assets/img/folder-icon.png"
            style={{
              width: '1.5rem',
              margin: '0 0.5rem',
              cursor: 'pointer',
            }}
          />
          <label
            onClick={() => selectFolder('수질')}
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            수질
          </label>
        </div>

        <div style={{ marginTop: '0.5rem', display: 'flex' }}>
          <img
            src="/assets/img/folder-icon.png"
            style={{ width: '1.5rem', margin: '0 0.5rem' }}
          />
          <label
            onClick={() => selectFolder('SEED')}
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            SEED
          </label>
        </div>

        <div style={{ marginTop: '0.5rem', display: 'flex' }}>
          <img
            src="/assets/img/folder-icon.png"
            style={{
              width: '1.5rem',
              margin: '0 0.5rem',
              cursor: 'pointer',
            }}
          />
          <label
            onClick={() => selectFolder('CUSTOM')}
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            CUSTOM
          </label>
        </div>
      </div>

      {/* 해당 row 모달 */}
      {filteredData.length > 0 && (
        <ForderListModal
          filteredData={filteredData}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      )}
    </div>
  );
}
