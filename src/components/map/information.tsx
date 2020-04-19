import React from 'react';
import styled from 'styled-components';
import { QuestionCircle } from '@styled-icons/fa-solid';
import { useDispatch } from 'react-redux';
import { setModal } from '../../redux/actions';

const InformationIconWrapper = styled(QuestionCircle)`
  width: 29px;
  height: 29px;
  position: absolute;
  margin: -50px 10px 0 0;
  right: 0;
  color: white;
  z-index: 10;
  pointer-events: auto;
  cursor: pointer;

  &:hover, :active {
    color: #29f1c3;
  }
`;

export const Information: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <InformationIconWrapper onClick={() => dispatch(setModal('information'))} />
  );
};

export default Information;
