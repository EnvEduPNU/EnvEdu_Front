import React, { useState } from 'react';
import { useGraphDataStore } from '../../store/graphStore';
import { AiFillCaretDown } from 'react-icons/ai';
import { GoX } from 'react-icons/go';

function Dropdown({ type, moreStyle, selectedIndex }) {
  const {
    variables,
    addSelectedYVariableIndexs,
    deleteSelectedYVariableIndexs,
    selectXVariableIndex,
    unselectXVariableIndex,
  } = useGraphDataStore();

  const [isOpen, setIsOpen] = useState(false);

  const selectDropdownItem = (data) => {
    console.log(data);
    deleteSelectedYVariableIndexs(selectedIndex);
    addSelectedYVariableIndexs(data.variableIndex);
    setIsOpen(false); //드롭다운 닫기
  };

  if (type === 'y')
    return (
      <div
        style={{ position: 'relative', display: 'inline-block', ...moreStyle }}
      >
        {/* 버튼 */}
        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center', // 아이콘과 텍스트 수직 정렬
            justifyContent: 'space-between', // 텍스트와 아이콘 간격
            backgroundColor: '#3b82f6', // bg-blue-500
            color: 'white', // text-white
            padding: '10px 16px', // 넓어진 패딩
            borderRadius: '8px', // rounded-lg
            outline: 'none', // focus:outline-none
            boxShadow: isOpen ? '0 0 0 4px rgba(59, 130, 246, 0.5)' : 'none', // focus:ring-2 focus:ring-blue-500
            cursor: 'pointer',
            border: 'none', // 기본 브라우저 스타일 제거
            width: '100%',
            position: 'relative', // 아이콘을 버튼 내부에 배치하기 위한 relative 속성
          }}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {/* 선택된 항목 */}
          <span style={{ flex: 1, textAlign: 'left' }}>
            {variables[selectedIndex].name}
          </span>

          {/* 드롭다운 아이콘 */}
          <AiFillCaretDown
            style={{
              marginLeft: '8px',
              fontSize: '16px',
              transition: 'transform 0.3s ease', // 회전 애니메이션
              transform: isOpen ? 'rotate(-90deg)' : 'rotate(0deg)', // 각도 조절
            }}
          />

          {/* 삭제 아이콘 (GoX) */}
          <GoX
            style={{
              position: 'absolute',
              top: '2px', // 버튼 내부 오른쪽 상단 모서리에 배치
              right: '1px',
              fontSize: '14px',
              color: 'white',
              backgroundColor: 'transparent', // 배경색으로 빨간색
              borderRadius: '50%', // 동그란 아이콘
              padding: '0px', // 아이콘 크기
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation(); // 버튼 클릭 이벤트와 분리
              // 삭제 로직을 이곳에 추가
              deleteSelectedYVariableIndexs(selectedIndex);
            }}
          />
        </button>

        {/* 드롭다운 리스트 */}
        {isOpen &&
          variables.filter(
            (data) => data.isSelected === false && data.type === 'Numeric',
          ).length !== 0 && (
            <div
              style={{
                position: 'absolute', // absolute
                marginTop: '8px', // mt-2
                width: '100%', // w-full
                backgroundColor: 'white', // bg-white
                border: '1px solid #d1d5db', // border border-gray-300
                borderRadius: '8px', // rounded-lg
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', // 더 강한 그림자 효과
                zIndex: 10, // z-10
                overflow: 'hidden', // 리스트 아이템 잘림 방지
                maxHeight: '300px', // 최대 높이 제한
                overflowY: 'auto', // 스크롤 가능
              }}
            >
              {variables
                .filter(
                  (data) =>
                    data.isSelected === false && data.type === 'Numeric',
                )
                .map((data) => (
                  <div
                    key={data.name}
                    style={{
                      padding: '12px 16px', // 여유로운 패딩
                      cursor: 'pointer', // cursor-pointer
                      backgroundColor: '#fff', // 기본 배경 색
                      transition: 'background-color 0.2s', // 부드러운 호버 효과
                      display: 'flex',
                      justifyContent: 'space-between', // 아이템 텍스트 및 추가 정보 간격 유지
                      alignItems: 'center', // 세로 가운데 정렬
                    }}
                    onClick={() => {
                      selectDropdownItem(data);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f3f4f6'; // hover:bg-gray-100
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#fff'; // 기본 배경 색으로 돌아감
                    }}
                  >
                    {/* 아이템 이름 */}
                    <span>{data.name}</span>

                    {/* 추가 정보 (선택적) */}
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {data.additionalInfo || ''}
                    </span>
                  </div>
                ))}
            </div>
          )}
      </div>
    );

  if (type === 'x')
    return (
      <div
        style={{ position: 'relative', display: 'inline-block', ...moreStyle }}
      >
        {/* 버튼 */}
        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center', // 아이콘과 텍스트 수직 정렬
            justifyContent: 'space-between', // 텍스트와 아이콘 간격
            backgroundColor: '#3b82f6', // bg-blue-500
            color: 'white', // text-white
            padding: '10px 16px', // 넓어진 패딩
            borderRadius: '8px', // rounded-lg
            outline: 'none', // focus:outline-none
            boxShadow: isOpen ? '0 0 0 4px rgba(59, 130, 246, 0.5)' : 'none', // focus:ring-2 focus:ring-blue-500
            cursor: 'pointer',
            border: 'none', // 기본 브라우저 스타일 제거
            width: '100%',
          }}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {/* 선택된 항목 */}
          <span style={{ flex: 1, textAlign: 'left' }}>
            {selectedIndex === -1 ? '선택 안됨' : variables[selectedIndex].name}
          </span>

          {/* 드롭다운 아이콘 */}
          <AiFillCaretDown
            style={{
              marginLeft: '8px',
              fontSize: '16px',
              transition: 'transform 0.3s ease', // 회전 애니메이션
              transform: isOpen ? 'rotate(-90deg)' : 'rotate(0deg)', // 각도 조절
            }}
          />
        </button>

        {/* 드롭다운 리스트 */}
        {isOpen &&
          variables.filter((data) => data.isSelected === false).length !==
            0 && (
            <div
              style={{
                position: 'absolute', // absolute
                marginTop: '8px', // mt-2
                width: '100%', // w-full
                backgroundColor: 'white', // bg-white
                border: '1px solid #d1d5db', // border border-gray-300
                borderRadius: '8px', // rounded-lg
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', // 더 강한 그림자 효과
                zIndex: 10, // z-10
                overflow: 'hidden', // 리스트 아이템 잘림 방지
                maxHeight: '300px', // 최대 높이 제한
                overflowY: 'auto', // 스크롤 가능
              }}
            >
              {variables
                .filter((data) => data.isSelected === false)
                .map((data) => (
                  <div
                    key={data.name}
                    style={{
                      padding: '12px 16px', // 여유로운 패딩
                      cursor: 'pointer', // cursor-pointer
                      backgroundColor: '#fff', // 기본 배경 색
                      transition: 'background-color 0.2s', // 부드러운 호버 효과
                      display: 'flex',
                      justifyContent: 'space-between', // 아이템 텍스트 및 추가 정보 간격 유지
                      alignItems: 'center', // 세로 가운데 정렬
                    }}
                    onClick={() => {
                      if (selectedIndex !== -1)
                        unselectXVariableIndex(selectedIndex);
                      selectXVariableIndex(data.variableIndex);
                      setIsOpen(false);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f3f4f6'; // hover:bg-gray-100
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#fff'; // 기본 배경 색으로 돌아감
                    }}
                  >
                    {/* 아이템 이름 */}
                    <span>{data.name}</span>

                    {/* 추가 정보 (선택적) */}
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {data.additionalInfo || ''}
                    </span>
                  </div>
                ))}
            </div>
          )}
      </div>
    );
}

export default Dropdown;
