import React from 'react';
import { useDispatch } from 'react-redux';
import newsContent from '../../data/news-content.json';
import { NewsContent } from '../../shared/models/NewsContent';
import { setModal } from '../../redux/actions';
import { ArticleLink } from '../summary/case-content';
import {
  ModalWrapper,
  CloseButton,
  MainContent,
  ModalWindow,
  Header,
  Title,
} from './modal';
import { ControlState } from '../../redux/reducers/control-reducer';

interface OwnProps {
  selectedCase: ControlState['selectedCase'];
}

export const CaseModal: React.FC<OwnProps> = ({ selectedCase }) => {
  const dispatch = useDispatch();
  const caseContent = newsContent.find((news: NewsContent) => news.patient === selectedCase?.properties.title);

  const createMarkup = (content: string) => ({
    __html: content,
  });

  return (
    <ModalWrapper onClick={() => dispatch(setModal(null))}>
      <ModalWindow>
        <Header>
          <Title>
            {selectedCase?.properties.title}
          </Title>
          <CloseButton onClick={() => dispatch(setModal(null))}>
            &#10005;
          </CloseButton>
        </Header>
        {caseContent?.content && <MainContent dangerouslySetInnerHTML={createMarkup(caseContent.content)} />}
        <i>
          Summary credits:
          {' '}
          <ArticleLink
            href='https://www.gov.sg/article/covid-19-cases-in-singapore'
            target='_blank'
            rel='noopener noreferrer'
          >
            gov.sg
          </ArticleLink>
        </i>
        <i>
          Read full article over
          {' '}
          <ArticleLink
            // eslint-disable-next-line max-len
            href={selectedCase?.properties.source || 'https://www.channelnewsasia.com/news/singapore/wuhan-virus-singapore-confirmed-cases-coronavirus-12324270'}
            target='_blank'
            rel='noopener noreferrer'
          >
            here
          </ArticleLink>
        </i>
        <span>
          Linked Clusters:
          {' '}
        </span>
        {selectedCase?.properties.linkedClusters.map((clusterName, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={index}>
            {(index ? ', ' : '')}
            <span>
              {clusterName}
            </span>
          </React.Fragment>
        ))}
      </ModalWindow>
    </ModalWrapper>
  );
};

export default CaseModal;
