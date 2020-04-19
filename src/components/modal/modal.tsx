import React from 'react';
import styled from 'styled-components';
import { UiState } from '../../redux/reducers/ui-reducer';
import { CaseModal } from './case-modal';
import { ControlState } from '../../redux/reducers/control-reducer';
import { InformationModal } from './information-modal';

interface Modal {
  modal: UiState['modal'];
  selectedCase: ControlState['selectedCase'];
}

export const ModalWrapper = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 100vw;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalWindow = styled.div`
  background-color: #100C07;
  color: white;
  display: flex;
  flex-direction: column;
  max-width: 70%;
  padding: 1.5rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 1rem;
`;

export const Title = styled.span`
  text-decoration: underline;
`;

export const CloseButton = styled.span`
  text-decoration: none;
  opacity: 0.3;

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`;

export const MainContent = styled.div`
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
`;

export const Modal: React.FC<Modal> = ({ modal, selectedCase }) => (
  <>
    {(() => {
      switch (modal) {
        default:
        case null:
          return null;
        case 'case':
          return <CaseModal selectedCase={selectedCase} />;
        case 'information':
          return <InformationModal />;
      }
    })()}
  </>
);
