import React from 'react';
import { LocationProperties } from '../../shared/models/Location';
import styled from 'styled-components';

const Title = styled.span`
  font-weight: bold;
`;

const CaseSpan = styled(Title)`
  &:hover {
   color: #f62459;
   cursor: pointer;
  }
`;

const CasesContainer = styled.div`
  max-height: 13vh;
  overflow: -moz-scrollbars-vertical;
  overflow-y: scroll;
`;

const CaseCount = Title;

export type ClusterContentProps =  Omit<LocationProperties, 'type'> & {
  onCaseClick: (patient: number) => void;
};

export const ClusterContent: React.FC<ClusterContentProps> = (props) => {
  const { cases, location, onCaseClick } = props;
  
  return <>
    <Title>{location}</Title>
    <br />
    <div>
      <span>Confirmed Cases:</span>
      <CaseCount>{` ${cases.length}`}</CaseCount>
    </div>   
    <span>Cases (click to view more):</span>
    <CasesContainer>
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
    </CasesContainer>
  </>;
};
