import React from 'react';
import { PointProperties } from '../../shared/models/PointProperties';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { setModal } from '../../redux/actions';

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
  const { title, confirmed, hospital, discharged, source } = props;
  const dispatch = useDispatch();
  const selectedCase = useSelector((state: RootState) => state.control.selectedCase);

  const openModal = () => {
    if (!selectedCase) {
      return ;
    }
    dispatch(setModal(true));
  }
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
          ? <><span>Discharged: </span><strong>{discharged}</strong><br /></>
          : null
      }
    </Description>
    <ModalLink onClick={openModal}>Read more</ModalLink>
  </CaseContentWrapper>
};
