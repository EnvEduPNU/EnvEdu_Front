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

    const resizeObserver = new ResizeObserver(updatePosition);

    // 컴포넌트가 마운트될 때 한 번 위치를 가져오기
    updatePosition();

    // ResizeObserver를 사용하여 ref로 지정된 컴포넌트의 크기 변경 감지
    if (componentRef.current) {
      resizeObserver.observe(componentRef.current);
    }

    // Recursive function to periodically check the position of the parent element
    const checkParentScroll = () => {
      if (componentRef.current) {
        updatePosition();
      }
      // window.requestAnimationFrame(checkParentScroll);
    };

    // Start checking the parent scroll position
    checkParentScroll();

    // Cleanup: Remove ResizeObserver and stop checking the parent scroll position
    return () => {
      if (componentRef.current) {
        resizeObserver.unobserve(componentRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return { ref: componentRef, position };
};

export default useComponentPosition;
