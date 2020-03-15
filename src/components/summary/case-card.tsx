import React from 'react';
import styled from 'styled-components';
import { Point, Feature, Polygon } from 'geojson';
import { PointProperties } from '../../shared/models/PointProperties';
import { ClusterContent } from './cluster-content';
import { CaseContent } from './case-content';
import { Cluster } from '../control/control';
import { LocationProperties } from '../../shared/models/Location';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { setSelectedCase } from '../../redux/actions';

interface CaseCardProps {
  selectedCase?: Feature<Point, PointProperties>;
  selectedCluster?: Feature<Polygon, LocationProperties>;
  type: Cluster;
}

const CaseCardWrapper = styled.div`
  background-color: rgba(0,0,0, 0.5);
  color: white;
  padding: 0.5rem;
  font-size: 0.8rem;
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
`;

export const CaseCard: React.FC<CaseCardProps> = (props) => {
  const { type, selectedCase, selectedCluster } = props;
  const dispatch = useDispatch();
  const clusterData = useSelector((state: RootState) => state.map.clusterData);

  const selectCase = (e: number) => {
    const selectedCase =  (clusterData.features.filter((feature: Feature<Point, PointProperties>) => feature.properties.id === `case-${e}`))[0];
    dispatch(setSelectedCase({
      ...selectedCase,
      shouldTriggerZoom: true
    }));
  };

  return (
    <CaseCardWrapper>
      {
        type === 'case'
          ? selectedCase && <CaseContent
            id={selectedCase.properties.id}
            title={selectedCase.properties.title}
            confirmed={selectedCase.properties.confirmed}
            discharged={selectedCase.properties.discharged}
            hospital={selectedCase.properties.hospital}
            source={selectedCase.properties.source}
          />
          : selectedCluster && <ClusterContent
            location={selectedCluster.properties.location}
            cases={selectedCluster.properties.cases}
            onCaseClick={selectCase}
          />
      }
    </CaseCardWrapper>
  );
};
