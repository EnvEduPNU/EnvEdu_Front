import { useState } from "react";
import * as Styled from "./Styled";
import Portal from "../../../Portal";
import useComponentPosition from "../../../DataLiteracy/hooks/useComponentPosition";
import { useEClassStore } from "../../store/eClassStore";
// import { Button } from "react-bootstrap";

const YoutubeTool = ({ pageNum }) => {
  const appendActivity = useEClassStore(state => state.appendActivity);
  const { ref, position } = useComponentPosition();
  const [url, setUrl] = useState("");
  const [visible, setVisible] = useState(false);
  const onClickTool = () => {
    setVisible(true);
  };
  const appendYoutube = e => {
    e.stopPropagation();
    setVisible(state => !state);

    if (
      /https:\/\/youtu.be\/.{11,}/.test(url) ||
      /https:\/\/www.youtube.com\/watch\?v=.{11,}/.test(url)
    ) {
      const src = `https://www.youtube-nocookie.com/embed/${url.slice(-11)}`;
      appendActivity(
        pageNum,
        <iframe
          id="ytplayer"
          type="text/html"
          width="600"
          height="305"
          src={src}
        />
      );
      setUrl("");
    }
  };
  return (
    <Styled.Tool ref={ref} onClick={onClickTool}>
      <svg viewBox="0 0 576 512">
        <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" />
      </svg>
      {visible && (
        <Portal>
          <Styled.Popup
            style={{
              left: position.left,
              top: position.top + 20,
            }}
          >
            <Styled.PopupTitle>유튜브 링크 등록</Styled.PopupTitle>
            <Styled.Block>
              <Styled.Input
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
              <Styled.Button onClick={e => appendYoutube(e)}>
                확인
              </Styled.Button>
            </Styled.Block>
          </Styled.Popup>
        </Portal>
      )}
    </Styled.Tool>
  );
};

export default YoutubeTool;
