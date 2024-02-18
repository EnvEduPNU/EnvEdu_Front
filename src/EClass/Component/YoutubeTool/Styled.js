import styled from "styled-components";

export const Tool = styled.button`
  position: relative;
  width: fit-content;
  min-width: 32px;
  height: 32px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* font-size: 1.75rem; */
  cursor: pointer;
  flex-shrink: 0;
  background: inherit;
  outline: none;
  border: none;
  &:hover {
    background-color: #fff;
    border: 1px solid #dadde6;
    border-radius: 3px;
  }
`;

export const Popup = styled.div`
  position: absolute;
  margin-top: 1rem;
  width: 20rem;
  background: #fff;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 4px;
  border-radius: 4px;
  padding: 1.5rem 1rem;
  z-index: 100001;
`;

export const PopupTitle = styled.div`
  font-weight: bold;
  color: #000;
`;

export const Block = styled.div`
  display: flex;
`;

export const Input = styled.input`
  color: var(--text1);
  background: transparent;
  flex: 1 1 0%;
  border-top: none;
  border-right: none;
  border-left: none;
  border-image: initial;
  outline: none;
  border-bottom: 1px inset rgb(173, 181, 189);
  font-size: 1rem;
  margin-right: 0.5rem;
  line-height: 1.5;
  padding: 0px;
`;

export const Button = styled.button`
  border: none;
  margin: 0;
  padding: 0;
  overflow: visible;

  background: transparent;

  /* inherit font & color from ancestor */
  color: inherit;
  font: inherit;

  line-height: normal;

  /* Corrects font smoothing for webkit */
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;

  padding: 0 5px;
  min-width: 35px;
  width: fit-content;
  height: 25px;
  border-radius: 5px;
  font-weight: 700;
  line-height: 1em;
  font-size: 14px;
  font-style: normal;
  text-align: center;
  color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  color: #fff;
  background-color: rgb(134, 142, 150);
`;
