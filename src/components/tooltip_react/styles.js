import styled from 'styled-components';

export const Container = styled.div`
  display: inline-block;
  position: relative;
  cusor: pointer;

  ${({ active }) => active && `
    color: #C23B44;
  `}
`;

export const HooverBox = styled.div`
  display: block;
  position: absolute;
  left: 30px;
  top: -8px;
  padding: 10px;
  text-align: left;
  max-width: 300px;
  border-radius: 2px;
  width: max-content;
  color: white;
  background-color: #BB3C41;
  z-index: 999999 !important;

  &:before {
    content: " ";
    position: absolute;
    top: 18px;
    right: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent #BB3C41 transparent transparent;
  }
`;
