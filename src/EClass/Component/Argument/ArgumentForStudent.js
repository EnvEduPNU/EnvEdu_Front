import { Form } from "react-bootstrap";
import useEClassAssignmentStore from "../../store/eClassAssignmentStore";

function ArgumentForStudent({ data, pageIndex, activityIndex }) {
  const changeEclassDataFieldValue = useEClassAssignmentStore(
    state => state.changeEclassDataFieldValue
  );
  return (
    <div style={{ padding: "0rem 3rem" }}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>조 이름</Form.Label>
        <Form.Control
          as="textarea"
          rows={1}
          value={data["title"]}
          onChange={e =>
            changeEclassDataFieldValue(
              pageIndex,
              activityIndex,
              "title",
              e.target.value
            )
          }
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
        <Form.Label>토론 내용 입력</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={data["content"]}
          onChange={e =>
            changeEclassDataFieldValue(
              pageIndex,
              activityIndex,
              "content",
              e.target.value
            )
          }
        />
      </Form.Group>
    </div>
  );
}

export default ArgumentForStudent;
