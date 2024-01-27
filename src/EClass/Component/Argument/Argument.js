import { useState } from "react";
import { Form } from "react-bootstrap";
import SubmitButton from "../SubmitButton/SubmitButton";

const Argument = () => {
  const [title, setTitle] = useState("");
  const [opinion, setOpinion] = useState("");
  return (
    <div style={{ padding: "0rem 3rem" }}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>조 이름</Form.Label>
        <Form.Control
          as="textarea"
          rows={1}
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
        <Form.Label>토론 내용 입력</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={opinion}
          onChange={e => setOpinion(e.target.value)}
        />
      </Form.Group>
      <SubmitButton text={"제출하기"} />
    </div>
  );
};

export default Argument;
