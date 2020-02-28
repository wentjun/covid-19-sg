import React from 'react';
import { PointProperties } from '../../shared/models/PointProperties';
import styled from 'styled-components';

const CaseContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Description = styled.div`
`;

export type CaseContent = PointProperties;

export const CaseContent: React.FC<CaseContent> = (props) => {
  const { title, confirmed, hospital, discharged, source } = props;

  return <CaseContentWrapper>
    <h3>{title}</h3>
    <Description>
      <span>Confirmed on: </span><strong>{confirmed}</strong>
    </Description>
    <Description>
      <span>Hospitalised at: </span><strong>{hospital}</strong>
    </Description>
    <Description>
      {
        discharged
          ? <><span>Discharged on: </span><strong>{discharged}</strong><br /></>
          : null
      }
    </Description>
    {
      source
        ? <a href={source} target='_blank' rel='noopener noreferrer'>article</a>
        : null
    }
  </CaseContentWrapper>
};
