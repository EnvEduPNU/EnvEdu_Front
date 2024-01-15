import * as Styled from "./Styled";

const Modal = ({ children, visible }) => {
  return (
    <>
      {visible && (
        <Styled.Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      <Styled.Wrapper>
        {visible && <Styled.Block>{children}</Styled.Block>}
      </Styled.Wrapper>
    </>
  );
};

export default Modal;
