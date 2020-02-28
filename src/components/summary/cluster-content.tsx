import React from 'react';
import { TransmissionClusterProperties } from '../../shared/models/ClusterZones';
import styled from 'styled-components';

const CaseSpan = styled.span`
  &:hover {
   color: #f62459;
   cursor: pointer;
  }
`;

export type ClusterContentProps = TransmissionClusterProperties & {
  onCaseClick: (patient: number) => void;
};

export const ClusterContent: React.FC<ClusterContentProps> = (props) => {
  const { cases, location, onCaseClick } = props;

  return <>
    <span><strong>{location}</strong></span>
    <br />
    <span>Cases: </span>
    <strong>
      {cases.map((patient: number, index) =>
        <React.Fragment key={index}>
          {(index ? ', ' : '')}
          <CaseSpan
            onClick={() => onCaseClick(patient)}
          >
            {`#${patient}`}
          </CaseSpan>
        </React.Fragment>
      )}
    </strong>
  </>;
};
