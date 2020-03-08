import React from 'react';
import { ModalWrapper, CloseButton, MainContent, ModalWindow, Header, Title } from './modal';
import { ControlState } from '../../redux/reducers/control-reducer';
import { useDispatch } from 'react-redux';
import { setModal } from '../../redux/actions';
import { ArticleLink } from '../summary/case-content';

export const InformationModal: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <ModalWrapper onClick={() => dispatch(setModal(null))}>
      <ModalWindow>
        <Header>
          <Title>
            About covid-tracker.com
          </Title>
          <CloseButton onClick={() => dispatch(setModal(null))}>
            &#10005;
          </CloseButton>
        </Header>
        <MainContent>
          <h3>Data</h3>
          <span>
            The data consists of COVID-19 cases and location clusters in Singapore. The data in this website is open sourced, and is freely available on this{' '}
            <ArticleLink href='https://github.com/wentjun/covid-19-sg' target='_blank' rel='noopener noreferrer' title='Singapore data'>
              Github repository
            </ArticleLink>
            {' '}for your usage. The full specification is described in the README.
          </span>
          <span>
            If you are looking for data from China and other parts of the world, you may refer to this{' '}
            <ArticleLink href='https://weileizeng.github.io/Open-Source-COVID-19/world' target='_blank' rel='noopener noreferrer' title='World data'>
              collection
            </ArticleLink>.
          </span>
          <h3>Methods</h3>
          <span>
            The data is visualised in a map format, using Mapbox. Apart from maps, the data can be visualised in other formats such as tables and bar charts.
          </span>
        </MainContent>
      </ModalWindow>
    </ModalWrapper>
  );
};
