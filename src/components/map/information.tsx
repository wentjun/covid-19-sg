import React from 'react';
import styled from 'styled-components';
import questionIcon from './question.png';

const InformationIconWrapper = styled.img`
  width: 29px;
  height: 29px;
  position: absolute;
  // float: right;
  margin-top: -50px;
  // clear:both
`;

export const Information: React.FC = (props) => {
  // <img src={questionIcon} alt='information' />
  console.log(props);
  return (
    <InformationIconWrapper src={questionIcon} alt='information' />
  );
};
