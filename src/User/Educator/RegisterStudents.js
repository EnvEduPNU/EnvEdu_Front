import React, { useState } from 'react';
import { customAxios } from '../../Common/CustomAxios';
import ExtendableInputs from '../../Common/ExtendableInputs';

function RegisterStudents() {
  /**
   * 교사가 자신이 지도하는 학생을 등록하는 컴포넌트
   */
  const [inputs, setInputs] = useState([]);

  function submit() {
    customAxios.post("/educator/student", { studentUsernames: inputs })
      .then(() => {
        alert("done");
      });
  }

  return (
    <div>
      <ExtendableInputs submit={submit} inputs={inputs} setInputs={setInputs}/>
    </div>
  );
}

export default RegisterStudents;