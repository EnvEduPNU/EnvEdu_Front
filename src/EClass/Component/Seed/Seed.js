import { Button } from "react-bootstrap";

const Seed = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <a href="/socket" target="_blank">
        <Button variant="dark">측정하러 가기</Button>
      </a>

      <Button
        variant="dark"
        style={{ marginTop: "0.5rem" }}
        // onClick={getData}
      >
        측정한 값 가져오기
      </Button>
    </div>
  );
};

export default Seed;
