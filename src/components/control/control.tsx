import React from 'react';
import styled from 'styled-components';
import { Feature } from 'geojson';
import { ClusterZones, ClusterLocation } from '../../shared/models/ClusterZones';

interface ControlProps {
  toggleDisplayTransmissionClusters: (displayTransmissionClusters: boolean) => void;
  setSelectedCluster: (selectedCluster: ClusterLocation) => void;
  displayTransmissionClusters: boolean;
  transmissionClusterData: Feature;
}

interface StyledProps {
  padding?: string;
  fontSize?: string;
}

const ControlWrapper = styled.div`
  background-color: rgba(0,0,0, 0.5);
  color: white;
  width: 20vw;
  position: absolute;
  z-index: 1;
  top: 1em;
  left: 1em;
`;

const ClusterSelect = styled.select`
  width: 100%;
`;

const Control: React.FC<ControlProps> = (props) => {
  const {
    toggleDisplayTransmissionClusters,
    displayTransmissionClusters,
    transmissionClusterData,
    setSelectedCluster
  } = props;
  const { locations } = transmissionClusterData.properties as ClusterZones;

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    toggleDisplayTransmissionClusters(e.target.checked);
  };

  const handleClusterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCluster(e.target.value as ClusterLocation);
  };

  return (
    <ControlWrapper>
      <span>Toggle Options</span>
      <input type='checkbox' checked={displayTransmissionClusters} onChange={handleCheck} />
      <label>Transmission Clusters</label>
      <br />
      <span>Currently viewing:</span>
      <ClusterSelect onChange={handleClusterSelect} defaultValue=''>
        <option disabled value=''>- select a location -</option>
        {
          locations.map((name: ClusterLocation) => <option key={name}>{name}</option>)
        }
      </ClusterSelect>
    </ControlWrapper>
  );

}

export default Control;
