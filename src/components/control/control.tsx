import React from 'react';
import styled from 'styled-components';
import { ClusterLocation } from '../../shared/models/ClusterZones';

interface ControlProps {
  toggleDisplayTransmissionClusters: (displayTransmissionClusters: boolean) => void;
  setSelectedCluster: (selectedCluster: ClusterLocation) => void;
  displayTransmissionClusters: boolean;
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

const CLUSTER_LOCATIONS: ClusterLocation[] = [
  'Grace Assembly of God Church (Tanglin)',
  'Grace Assembly of God Church (Bukit Batok)',
  'Yong Thai Hang',
  'The Life Church and Missions Singapore',
  'Grand Hyatt Singapore' ,
  'Seletar Aerospace Heights'
];

const Control: React.FC<ControlProps> = (props) => {
  const {
    toggleDisplayTransmissionClusters,
    displayTransmissionClusters,
    setSelectedCluster
  } = props;

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
      <ClusterSelect
        disabled={!displayTransmissionClusters}
        onChange={handleClusterSelect}
        defaultValue=''
      >
        <option disabled value=''>- select a location -</option>
        {
          CLUSTER_LOCATIONS.map((name: ClusterLocation) => <option key={name}>{name}</option>)
        }
      </ClusterSelect>
    </ControlWrapper>
  );

}

export default Control;
