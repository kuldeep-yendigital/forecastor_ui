import styled from 'styled-components';

export const SearchBox = styled.input`
  &&& {
    background: #F0F1F3;
    border: none;
    color: #989CA7;
    border-radius: 25px;
    height: 25px;
    width: 90%;
    margin: 2px;
    padding: 5px 10px;
    font-size: 0.85rem;
  }

  &&&:focus {
    border: none !importnat;
    outline: none;
    box-shadow: none !important;
    border-bottom: none !important;
    -webkit-box-shadow: none !important;
  }
`;

export const Button = styled.button`
  &&& {
    background-color: white;
    color: #C04D55;
    width: 50%;
    padding: 10px;
    border: 1px solid #E8EAED;
  }
`;


export const ItemList = styled.ul`
  overflow: scroll;
  height: 300px;


  &&& li {
    padding: 5px;
    margin: 0;
    width: 100%;
    display: flex;
    align-items: center;
    line-height: 0.85rem;
    overflow: hidden;
    text-overflow: clip;
  }
`;


export const Label = styled.span`
  font-size: 1.1em;
  white-space: normal;
`;


export const SearchBoxWrapper = styled.div`
  border-bottom: 1px solid #E9EBEE;
  padding: 5px;

  &&& .search-icon {
    width: 20px;
    right: 14px;
    top: 15px;
    opacity: 0.2;
    left: unset;
  }
`;