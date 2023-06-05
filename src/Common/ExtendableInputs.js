import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

function ExtendableInputs(props) {
  /**
   * 서버로 여러 개의 데이터를 전송하기 위한 확장 가능한 input
   * 제출을 위한 submit function, input 관리를 위한 input state 및 setState function을 필수적으로 prop으로 전달해야 함 + input에 사용할 placeholder(optional)
   * src/User/Educator/RegisterStudent.js, src/Device/Manager/AddMACForm.js에서 사용 예시 참고
   */
  function addInput() {
    props.setInputs([...props.inputs, '']);
  }

  function handleInputChange(index, event) {
    const newInputs = [...props.inputs];
    newInputs[index] = event.target.value;
    props.setInputs(newInputs);
  }

  function removeInput(index) {
    const newInputs = [...props.inputs];
    newInputs.splice(index, 1);
    props.setInputs(newInputs);
  }

  return (
    <div>
      <Button onClick={addInput}>Add</Button>
      {props.inputs.map((input, index) => (
        <div key={index}>
          <input
            value={input}
            onChange={(event) => handleInputChange(index, event)}
            placeholder={props.placeholder === null ? "" : props.placeholder}
          />
          <Button onClick={() => removeInput(index)}>X</Button>
        </div>
      ))}
      <Button type="submit" onClick={props.submit}>submit</Button>
    </div>
  );
}

export default ExtendableInputs;