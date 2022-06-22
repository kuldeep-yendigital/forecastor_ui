import styled from 'styled-components';

export const Container = styled.div`
  background-color: white;
  position: relative;
  height: 100%;
  overflow: hidden;
  padding-top: 40px;

  > section {
    position: relative;
    z-index: 2;
    text-align: center;
  }

  ::before {
    content: '';
    height: 45%;
    background-color: rgb(246, 246, 247);
    position: absolute;
    top: -15%;
    width: 110%;
    z-index: 1;
    transform: rotate(3deg);
  }
`;

export const H1 = styled.h1`
  color: rgb(165,78,172);
  text-align: center;
  width: 100%;
`;

export const H2 = styled.h2`
  margin-top: 10px;
  text-align: center;
  width: 100%;
`;

export const UL = styled.ul`
  margin: 135px auto 0;
  display: inline-block;
`;

export const Box = styled.li`
  display: inline-block;
  box-shadow: 0px 2px 1px 1px rgba(235, 235, 235, .8);
  max-width: 40%;
  padding: 25px;
  background-color: white;
  position: relative;

  &:first-child {
    margin-right: 14px;
  }
`;

export const BoxTitle = styled.h3`
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 70px;
  background-color: rgb(86, 92, 105);
  color: white;
  border-radius: 50%;
  font-size: 14px;
  text-align: center;
  line-height: 73px;
  font-weight: 800;
`;
