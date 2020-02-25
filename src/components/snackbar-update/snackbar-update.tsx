import React from 'react';
import styled from 'styled-components';

const SnackbarWrapper = styled.div`
  background-color: rgba(0,0,0, 0.5);
  color: white;
  font-size: 0.8rem;
  width: 70vw;
  max-width: 800px;
  position: absolute;
  z-index: 1;
  bottom: 1rem;
  padding: 0.5rem;

  display: flex;
  flex-direction: row;
  justify-content: center;

`;

const DismissSpan = styled.span`
  padding-left: 0.5rem;

  &:hover {
   color: #f62459;
   cursor: pointer;
  }
`;

interface SnackbarUpdate {
  onDismiss: () => void;
}

const SnackbarUpdate: React.FC<SnackbarUpdate> = ({ onDismiss }) => {
  return <SnackbarWrapper>
    <span>New updates available!</span>
    <DismissSpan onClick={onDismiss}>Click here to refresh.</DismissSpan>
  </SnackbarWrapper>;
};

export default SnackbarUpdate;
