import styled from 'styled-components';

export const Anchor = styled.a`
  padding: 12px 11px 11px !important;
`;

export const Menu = styled.div`
  display: block;
  position: absolute;
  left: 0px;
  text-align: left;
  font-size: 13px;
  width: 170px;
  padding: 5px 0;
  background-color: white;
  border: 1px solid #EDEDED;
  z-index: 9999 !important;

`;

export const ItemToolTip = styled.div`
  position: absolute !important;
  right: 0;
  top: 12px;
  color: #767676;
`;

export const ListItem = styled.li`
  position: relative;
  padding: 15px 0 15px 30px;
  cursor: pointer;
  &:hover {
    background: #F6F6F7;
  }
`;


export const ItemTitle = styled.span`
`;


export const CheckIconWrapper = styled.div`
  color: #767676;
  position: absolute !important;
  top: 12px;
  left: 0;
  margin: 0;
`;

export const Container = styled.span`
  display: inline-block;
  position: relative;
`;