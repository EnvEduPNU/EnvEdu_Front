import { useRef, useState } from "react";
import * as Styled from "./Styled";

function Thumbnail() {
  const imgRef = useRef();
  const [url, setUrl] = useState(null);
  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setUrl(reader.result);
    };
  };
  return (
    <Styled.Wrapper
      onClick={() => {
        imgRef.current.click();
      }}
    >
      <input
        type="file"
        accept="image/*"
        id="profileImg"
        onChange={saveImgFile}
        ref={imgRef}
        style={{
          display: "none",
        }}
      />
      <Styled.Preview $isImg={url} />
      {url != null && <Styled.Img src={url} />}
    </Styled.Wrapper>
  );
}

export default Thumbnail;
