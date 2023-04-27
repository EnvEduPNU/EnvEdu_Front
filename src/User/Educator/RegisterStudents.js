import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { customAxios } from '../../Common/CustomAxios';

function RegisterStudents() {
  const [inputs, setInputs] = useState([]);

  function addInput() {
    setInputs([...inputs, '']);
  }

  function handleInputChange(index, event) {
    const newInputs = [...inputs];
    newInputs[index] = event.target.value;
    setInputs(newInputs);
  }

  function removeInput(index) {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  }

  function submit() {
    customAxios.post("/educator/student", { studentUsernames: inputs })
      .then(() => {
        alert("done");
      });
  }

  return (
    <div>
      <Button onClick={addInput}>Add</Button>
      {inputs.map((input, index) => (
        <div key={index}>
          <input
            value={input}
            onChange={(event) => handleInputChange(index, event)}
          />
          <Button onClick={() => removeInput(index)}>X</Button>
        </div>
      ))}
      <Button type="submit" onClick={submit}>dd</Button>
    </div>
  );
}

export default RegisterStudents;