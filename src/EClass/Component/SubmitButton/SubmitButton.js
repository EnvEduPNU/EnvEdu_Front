import { Button } from "react-bootstrap";

function SubmitButton({ text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Button variant="dark">{text}</Button>
    </div>
  );
}

export default SubmitButton;
