import { useRef } from "react";
import * as Styled from "./Styled";
import { useEClassStore } from "../../store/eClassStore";
import ClassroomType from "../../utils/classRoomType";

const ImageTool = ({ pageNum }) => {
  const appendActivity = useEClassStore(state => state.appendActivity);
  const imgRef = useRef();
  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      appendActivity(
        pageNum,
        <img
          style={{ maxWidth: "500px" }}
          src={reader.result}
          alt="업로드 이미지"
        />,
        ClassroomType.PIC
      );
    };
  };

  return (
    <Styled.Tool
      onClick={() => {
        imgRef.current.click();
      }}
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        height="1.3em"
        width="1.3em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path>
      </svg>
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
    </Styled.Tool>
  );
};

export default ImageTool;
