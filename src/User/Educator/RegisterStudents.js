import React, { useState } from 'react';
import { customAxios } from '../../Common/CustomAxios';
import ExtendableInputs from '../../Common/ExtendableInputs';

function RegisterStudents() {
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