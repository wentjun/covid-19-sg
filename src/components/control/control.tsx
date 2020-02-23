import React from 'react';
import styled from 'styled-components';
import { ClusterLocation } from '../../shared/models/ClusterZones';
import { MapState } from '../../redux/reducers/map-reducer';
import { Point, Feature } from 'geojson';
import { PointProperties } from '../../shared/models/PointProperties';
import { ControlState } from '../../redux/reducers/control-reducer';

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
  dateEndRange: ControlState['dateEndRange'];
}

type cluster = 'case' | 'transmission';

const ControlWrapper = styled.div`
  background-color: rgba(0,0,0, 0.5);
  color: white;
  width: 30vw;
  position: absolute;
  z-index: 1;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem;

  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 90vw;
    flex-direction: row;
  }
`;

const ClusterSelect = styled.select`
  width: 100%;
`;

const Slider = styled.input`
  width: 100%;
  text-align: center;
`;

const RangeSpan = styled.span`
  font-size: 0.8rem;
`;

const ToggleGroup = styled.div`
  padding: 0.5rem;
  flex-grow: 1;
  flex-basis: 0;
`;

const CLUSTER_LOCATIONS: ClusterLocation[] = [
  'Grace Assembly of God Church (Tanglin)',
  'Grace Assembly of God Church (Bukit Batok)',
  'Yong Thai Hang',
  'The Life Church and Missions Singapore',
  'Grand Hyatt Singapore' ,
  'Seletar Aerospace Heights'
];

const START_DATE = '2020-01-23';
const DIFFERENCE = +new Date() - +new Date(START_DATE);
const DAYS  = Math.ceil(DIFFERENCE / (1000 * 60 * 60 * 24));

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
    setDateRange,
    dateEndRange
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
    setDateRange(DAYS - Number(e.target.value));
  };

  return (
    <ControlWrapper>
    <ToggleGroup>
      <div>
        <input
          type='checkbox'
          checked={displayTransmissionClusters}
          onChange={(e) => handleCheck(e, 'transmission')}
          disabled={!ready}
        />
        <label>Transmission Clusters</label>
      </div>
      <span>Jump to:</span>
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
      </ToggleGroup>
      <ToggleGroup>
        <div>
          <input
            type='checkbox'
            checked={displayCaseClusters}
            onChange={(e) => handleCheck(e, 'case')}
            disabled={!ready}
          />
          <label>Cases Clusters</label>
        </div>
        <div>
          <span>Jump to:</span>
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
      </ToggleGroup>
      <ToggleGroup>
        <span>Date Range:</span>
        <Slider
          id='taxiRangeSliderInput'
          type='range'
          min='1'
          max={DAYS}
          onChange={handleRangeChange}
          step='1'
          defaultValue={DAYS}
          disabled={!ready}
        />
        <RangeSpan>2020-01-23 to {dateEndRange.toLocaleDateString('fr-CA')}</RangeSpan>
      </ToggleGroup>
    </ControlWrapper>
  );
};

export default Control;
