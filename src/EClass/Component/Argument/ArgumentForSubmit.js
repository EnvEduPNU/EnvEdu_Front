import { Form } from "react-bootstrap";

function ArgumentForSubmit({ data }) {
  return (
    <div style={{ padding: "0rem 3rem" }}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>조 이름</Form.Label>
        <Form.Control as="textarea" rows={1} value={data["title"]} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
        <Form.Label>토론 내용</Form.Label>
        <Form.Control as="textarea" rows={5} value={data["content"]} />
      </Form.Group>
    </div>
  );
}

export default ArgumentForSubmit;
