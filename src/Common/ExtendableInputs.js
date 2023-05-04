import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

function ExtendableInputs(props) {
    // const [inputs, setInputs] = useState([]);

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
          />
          <Button onClick={() => removeInput(index)}>X</Button>
        </div>
      ))}
      <Button type="submit" onClick={props.submit}>submit</Button>
    </div>
  );
}

export default ExtendableInputs;