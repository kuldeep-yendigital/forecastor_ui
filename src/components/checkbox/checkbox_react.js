import React from 'react';
import styled from 'styled-components';


const Check = styled.input`
  &&&:checked + label:after {
    border: 2px solid rgb(165,78,172);
    background-color: rgb(165,78,172);
    display: table-cell;
    vertical-align: middle;
    white-space: normal;
  }
  &&& + label:after {
    border: 2px solid rgb(165,78,172);
    display: table-cell;
    vertical-align: middle;
    white-space: normal;
  }

  &&& {
    height: 100%;
    display: table-cell;
    vertical-align: middle;
  }
  &&& + label {
    display: table-cell;
    vertical-align: middle;
  }
`;


const Wrapper = styled.span`
  white-space: normal !important;
  display: table;
  vertical-align: middle;
`;


function Checkbox({ onClick, checked }) {
  return (
    <Wrapper className="checkbox" onClick={onClick}>
      <Check className="filled-in" onChange={onClick} type="checkbox" checked={checked} />
      <label className="au-target"></label>
    </Wrapper>
  );
}

export default Checkbox;