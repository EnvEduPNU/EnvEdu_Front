import { useCallback, useState } from "react";
import * as Styled from "./Styled"; // 가정된 스타일드 컴포넌트 경로

function LabelInput({ labelName, defaultValue, onChange }) {
  // 입력 값에 대한 내부 상태를 관리
  const [value, setValue] = useState(defaultValue);

  // useCallback을 사용하여 입력 처리 함수를 메모이제이션
  // 이렇게 하면 입력 필드가 렌더링될 때마다 함수를 새로 생성하지 않아도 됨
  const onChangeInput = useCallback(
    (e) => {
      const newValue = e.target.value;
      onChange(newValue); // 부모 컴포넌트에 변경을 알림
      setValue(newValue); // 내부 상태 업데이트
    },
    [onChange]
  );

  return (
    <Styled.Wrapper>
      <Styled.Label>{labelName}</Styled.Label>
      <Styled.Input type="number" value={value} onChange={onChangeInput} />
    </Styled.Wrapper>
  );
}

export default LabelInput;
