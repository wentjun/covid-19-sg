import React from 'react';
import styled from 'styled-components';
import { ClusterLocation } from '../../shared/models/ClusterZones';
import { MapState } from '../../redux/reducers/map-reducer';
import { Point, Feature } from 'geojson';
import { PointProperties } from '../../shared/models/PointProperties';

interface ControlProps {
  toggleDisplayTransmissionClusters: (displayTransmissionClusters: boolean) => void;
  toggleDisplayCaseClusters: (displayCaseClusters: boolean) => void;
  setSelectedCluster: (selectedCluster: ClusterLocation) => void;
  setSelectedCase: (selectedCase: Feature<Point, PointProperties>) => void;
  setDateRange: (numberOfDays: number) => void;
  displayTransmissionClusters: boolean;
  displayCaseClusters: boolean;
  ready: boolean;
  clusterData: MapState['clusterData'];
}

type cluster = 'case' | 'transmission';

const ControlWrapper = styled.div`
  background-color: rgba(0,0,0, 0.5);
  color: white;
  width: 30vw;
  position: absolute;
  z-index: 1;
  top: 1em;
  left: 1em;
  padding: 0.5rem;

  display: flex;
  flex-direction: column;
`;

const ClusterSelect = styled.select`
  width: 100%;
`;

const Slider = styled.input`
  width: 100%;
  text-align: center;
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
    toggleDisplayCaseClusters,
    displayTransmissionClusters,
    displayCaseClusters,
    setSelectedCluster,
    setSelectedCase,
    ready,
    clusterData,
    setDateRange
  } = props;

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, type: cluster) => {
    if (type === 'transmission') {
      toggleDisplayTransmissionClusters(e.target.checked);
    } else if (type === 'case') {
      toggleDisplayCaseClusters(e.target.checked);
    }
  };

  const handleClusterSelect = (e: React.ChangeEvent<HTMLSelectElement>, type: cluster) => {
    if (type === 'transmission') {
      setSelectedCluster(e.target.value as ClusterLocation);
    } else if (type === 'case') {
      const selectedFeature = clusterData.features[Number(e.target.value)];
      setSelectedCase(selectedFeature);
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange(Number(e.target.value));
  }

  const startDate = '2020-01-23';
  const timeDiff = +new Date() - +new Date(startDate);
  const days = timeDiff / (1000 * 60 * 60 * 24)
  console.log(days)

  return (
    <ControlWrapper>
      <span>Toggle Options</span>
      <div>
        <input
          type='checkbox'
          checked={displayTransmissionClusters}
          onChange={(e) => handleCheck(e, 'transmission')}
          disabled={!ready}
        />
        <label>Transmission Clusters</label>
      </div>
      <span>Currently viewing:</span>
      <ClusterSelect
        disabled={!displayTransmissionClusters || !ready}
        onChange={(e) => handleClusterSelect(e, 'transmission')}
        defaultValue=''
      >
        <option disabled value=''>- select a location -</option>
        {
          CLUSTER_LOCATIONS.map((name: ClusterLocation) => <option key={name}>{name}</option>)
        }
      </ClusterSelect>
      <div>
        <input
          type='checkbox'
          checked={displayCaseClusters}
          onChange={(e) => handleCheck(e, 'case')}
          disabled={!ready}
        />
        <label>Cases Clusters</label>
        <ClusterSelect
          disabled={!displayCaseClusters || !ready}
          onChange={(e) => handleClusterSelect(e, 'case')}
          defaultValue=''
        >
          <option disabled value=''>- select a case -</option>
          {
            clusterData.features.map(({ properties: { id, title } }: Feature<Point, PointProperties>, index) => <option key={id} value={index}>{title}</option>)
          }
        </ClusterSelect>
      </div>
      <Slider
        id='taxiRangeSliderInput'
        type='range'
        min='0'
        max={days}
        // value={this.props.taxiCount}
        onChange={handleRangeChange}
        step='1'
      />
    </ControlWrapper>
  );

}

export default Control;
