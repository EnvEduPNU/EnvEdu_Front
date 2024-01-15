import * as Styled from "./Styled";
import Modal from "../Modal/Modal";
import { ReactComponent as CloseIcon } from "../../image/CloseIcon.svg";

const Dialog = ({
  visible,
  title,
  content,
  subText,
  onClose,
  onConfirm,
  onClickSubText,
}) => {
  return (
    <Modal visible={visible}>
      <Styled.Wrapper>
        <Styled.header>
          <CloseIcon onClick={onClose} />
        </Styled.header>
        <Styled.Contents>
          <div>{title}</div>
          <div className="content">{content}</div>
        </Styled.Contents>
        <button className="confirm_button" onClick={onConfirm}>
          확인
        </button>
        {subText !== undefined && (
          <Styled.SubText onClick={onClickSubText}>{subText}</Styled.SubText>
        )}
      </Styled.Wrapper>
    </Modal>
  );
};

export default Dialog;
