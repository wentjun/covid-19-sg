import React from 'react';
import { PointProperties } from '../../shared/models/PointProperties';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { setModal } from '../../redux/actions';
import { Title } from './cluster-content';

const CaseContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Description = styled.div`
`;

const ModalLink = styled.a`
  color: #f62459;
  text-decoration: underline;

  &:hover {
    cursor: pointer;
  }
`;

export const ArticleLink = styled.a`
  color: #f62459
`;

export type CaseContent = PointProperties;

export const CaseContent: React.FC<CaseContent> = (props) => {
  const { title, confirmed, hospital, discharged, nationality, residenceAreas, placesVisited, age, death, transmissionSource } = props;
  const dispatch = useDispatch();
  const selectedCase = useSelector((state: RootState) => state.control.selectedCase);

  const openModal = () => {
    if (!selectedCase) {
      return ;
    }
    dispatch(setModal('case'));
  };

  return (
    <CaseContentWrapper>
      <Title>{title}</Title>
      <Description>
        <span>Confirmed on: </span>
        <strong>{confirmed}</strong>
      </Description>
      <Description>
        <span>Hospitalised at: </span>
        <strong>{hospital}</strong>
      </Description>
      <Description>
        {
          discharged
            ? <>
                <span>Discharged: </span>
                <strong>{discharged}</strong><br />
              </>
            : null
        }
      </Description>
      <Description>
        {
          death
            ? <>
                <span>Death: </span>
                <strong>{death}</strong><br />
              </>
            : null
        }
      </Description>
      <Description>
        <span>Age: </span>
        <strong>{age}</strong>
      </Description>
      <Description>
        <span>Source: </span>
        <strong>{transmissionSource}</strong>
      </Description>
      <Description>
        <span>Nationality: </span>
        <strong>{nationality}</strong>
      </Description>
      <Description>
        <span>Places of Residence: </span>
        {
          residenceAreas.map((area, index) =>
            <React.Fragment key={index}>
              {(index ? ', ' : '')}
              <strong>
                {area}
              </strong>
            </React.Fragment>
          )
        }
      </Description>
      <Description>
        <span>Places Visited: </span>
        {
          placesVisited.map((area, index) =>
            <React.Fragment key={index}>
              {(index ? ', ' : '')}
              <strong>
                {area}
              </strong>
            </React.Fragment>
          )
        }
      </Description>
      <ModalLink onClick={openModal}>Read more</ModalLink>
    </CaseContentWrapper>
  );
};

export default React.memo(CaseContent);