import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { PointProperties } from '../../shared/models/PointProperties';
import { RootState } from '../../redux/reducers';
import { setModal } from '../../redux/actions';
import { Title } from './cluster-content';

const CaseContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ModalLink = styled.a`
  color: #f62459;
  text-decoration: underline;

  &:hover {
    cursor: pointer;
  }
`;

export const ArticleLink = styled.a`
  color: #f62459;
`;

export type CaseContent = PointProperties;

export const CaseContent: React.FC<CaseContent> = (props) => {
  const {
    title, confirmed, hospital, discharged, nationality, residenceAreas, placesVisited, age, death, transmissionSource,
  } = props;
  const dispatch = useDispatch();
  const selectedCase = useSelector((state: RootState) => state.control.selectedCase);

  const openModal = () => {
    if (!selectedCase) {
      return;
    }
    dispatch(setModal('case'));
  };

  return (
    <CaseContentWrapper>
      <Title>{title}</Title>
      <div>
        <span>Confirmed on: </span>
        <strong>{confirmed}</strong>
      </div>
      <div>
        <span>Hospitalised at: </span>
        <strong>{hospital}</strong>
      </div>
      <div>
        {
          discharged
            ? (
              <>
                <span>Discharged: </span>
                <strong>{discharged}</strong>
                <br />
              </>
            )
            : null
        }
      </div>
      <div>
        {
          death
            ? (
              <>
                <span>Death: </span>
                <strong>{death}</strong>
                <br />
              </>
            )
            : null
        }
      </div>
      <div>
        <span>Age: </span>
        <strong>{age}</strong>
      </div>
      <div>
        <span>Source: </span>
        <strong>{transmissionSource}</strong>
      </div>
      <div>
        <span>Nationality: </span>
        <strong>{nationality}</strong>
      </div>
      <div>
        <span>Places of Residence: </span>
        {
          residenceAreas.map((area, index) => (
            <React.Fragment key={area}>
              {(index ? ', ' : '')}
              <strong>
                {area}
              </strong>
            </React.Fragment>
          ))
        }
      </div>
      <div>
        <span>Places Visited: </span>
        {
          placesVisited.map((area, index) => (
            <React.Fragment key={area}>
              {(index ? ', ' : '')}
              <strong>
                {area}
              </strong>
            </React.Fragment>
          ))
        }
      </div>
      <ModalLink onClick={openModal}>Read more</ModalLink>
    </CaseContentWrapper>
  );
};

export default React.memo(CaseContent);
