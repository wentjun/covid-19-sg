import React from 'react';
import styled from 'styled-components';
import { LocationProperties } from '../../shared/models/Location';

export const Title = styled.span`
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

export type ClusterContentProps = Omit<LocationProperties, 'type'> & {
  onCaseClick: (patient: number) => void;
  importedCaseCount?: number;
};

export const ClusterContent: React.FC<ClusterContentProps> = (props) => {
  const {
    cases, location, onCaseClick, importedCaseCount,
  } = props;

  return (
    <>
      <Title>{location}</Title>
      <br />
      {
      location === 'Changi Airport (Imported Cases)'
        ? (
          <div>
            <span>Imported Cases:</span>
            <CaseCount>{importedCaseCount}</CaseCount>
          </div>
        )
        : (
          <div>
            <span>Confirmed Cases:</span>
            <CaseCount>{` ${cases.length}`}</CaseCount>
          </div>
        )
      }
      <span>Cases (click to view more):</span>
      <CasesContainer>
        {cases.map((patient: number, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={index}>
            {(index ? ', ' : '')}
            <CaseSpan
              onClick={() => onCaseClick(patient)}
            >
              {`#${patient}`}
            </CaseSpan>
          </React.Fragment>
        ))}
      </CasesContainer>
    </>
  );
};

export default React.memo(ClusterContent);
