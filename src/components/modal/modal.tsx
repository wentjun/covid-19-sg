import React from 'react';
import styled from 'styled-components';
import newsContent from '../../data/news-content.json';
import { NewsContent } from '../../shared/models/NewsContent';
import { RootState } from '../../redux/reducers';
import { useSelector, useDispatch } from 'react-redux';
import { setModal } from '../../redux/actions';
import { ArticleLink } from '../summary/case-content';

const ModalWrapper = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 100vw;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalWindow = styled.div`
  background-color: rgba(0,0,0);
  color: white;
  display: flex;
  flex-direction: column;
  max-width: 70%;
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 1rem;
`;

const Title = styled.span`
  text-decoration: underline;
`;

const CloseButton = styled.span`
  text-decoration: none;
  opacity: 0.3;

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`;

const MainContent = styled.div`
  padding-bottom: 1rem;
`;

export const Modal: React.FC = () => {
  const dispatch = useDispatch();
  const {
    ui: { modal },
    control: { selectedCase }
  } = useSelector((state: RootState) => state);
  const caseContent = newsContent.find((news: NewsContent) => news.patient === selectedCase?.properties.title);

  const createMarkup = (content: string) => {
    return {
      __html: content
    };
  };

  return <>
    {
      (modal && selectedCase && caseContent?.content)
      ? <ModalWrapper onClick={() => dispatch(setModal(false))}>
        <ModalWindow>
          <Header>
            <Title>
              {selectedCase.properties.title}
            </Title>
            <CloseButton onClick={() => dispatch(setModal(false))}>
              &#10005;
            </CloseButton>
          </Header>
          <MainContent dangerouslySetInnerHTML={createMarkup(caseContent.content)}/>
          <i>Summary credits:&nbsp;
            <ArticleLink href='https://www.gov.sg/article/covid-19-cases-in-singapore' target='_blank' rel='noopener noreferrer'>
              gov.sg
            </ArticleLink>
          </i>
          <i>Read full article over&nbsp;
            <ArticleLink
              href={selectedCase.properties.source || 'https://www.channelnewsasia.com/news/singapore/wuhan-virus-singapore-confirmed-cases-coronavirus-12324270'}
              target='_blank'
              rel='noopener noreferrer'
            >
              here
            </ArticleLink>
          </i>
        </ModalWindow>
      </ModalWrapper>
      : null
    }
  </>;
};
