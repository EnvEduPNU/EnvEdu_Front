import { useEffect, useRef, useState } from "react";

const useComponentPosition = () => {
  const componentRef = useRef(null);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updatePosition = () => {
      const boundingBox = componentRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      setPosition({
        top: boundingBox.top + window.scrollY,
        left: boundingBox.left + window.scrollX,
        bottom:
          windowHeight -
          (boundingBox.top + boundingBox.height) +
          window.scrollY,
        right:
          windowWidth - (boundingBox.left + boundingBox.width) + window.scrollX,
        width: boundingBox.width,
        height: boundingBox.height,
      });
    };

    // 컴포넌트가 마운트될 때 한 번 위치를 가져오기
    updatePosition();

    // 창의 크기가 변경될 때마다 위치 업데이트
    window.addEventListener("resize", updatePosition);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  return { ref: componentRef, position };
};

export default useComponentPosition;
