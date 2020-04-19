import React, { Suspense } from 'react';
import styled from 'styled-components';
import { MapState } from '../../redux/reducers/map-reducer';
import { Point, Feature } from 'geojson';
import { PointProperties } from '../../shared/models/PointProperties';
import { ControlState, SelectedCluster, SelectedCase } from '../../redux/reducers/control-reducer';
import { groupedOptions, casesOptions } from './options';
// const ReactSelect = React.lazy(() => import('react-select'));
import Select from 'antd/es/select';
import 'antd/dist/antd.css';
const { Option, OptGroup } = Select;

interface ControlProps {
  toggleDisplayTransmissionClusters: (displayTransmissionClusters: boolean) => void;
  toggleDisplayCaseClusters: (displayCaseClusters: boolean) => void;
  setSelectedCluster: (selectedCluster: SelectedCluster) => void;
  setSelectedCase: (selectedCase: SelectedCase) => void;
  setDateRange: (numberOfDays: number) => void;
  displayTransmissionClusters: boolean;
  displayCaseClusters: boolean;
  ready: boolean;
  clusterData: MapState['clusterData'];
  transmissionClusterData: MapState['transmissionClusterData'];
  dateEndRange: ControlState['dateEndRange'];
  selectedCase: ControlState['selectedCase'];
  selectedCluster: ControlState['selectedCluster'];
}

export type Cluster = 'case' | 'transmission';

const ControlWrapper = styled.div`
  background-color: rgba(0,0,0,0.5);
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
    flex-wrap: wrap;
    justify-content: space-between;
  }

  @media screen and (orientation: landscape) and (max-width: 896px) {
    width: 40vw;
  }
`;

const ClusterSelect = styled.select`
  font-size: 16px;
  width: 100%;
`;

// const Select = styled(ReactSelect)`
//   height: 25px;
//   width: 100%;
// `;

const Slider = styled.input`
  width: 100%;
  text-align: center;

  &::-webkit-slider-thumb {
    width: 25px;
    height: 25px;
  }

  &::-moz-range-thumb {
    width: 25px;
    height: 25px;
  }

  &::-ms-thumb {
    width: 25px;
    height: 25px;
  }
`;

const RangeSpan = styled.span`
  font-size: 0.8rem;
`;

const ToggleGroup = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex: 0 1 40vw;
  }

  @media screen and (orientation: landscape) and (max-width: 896px) {
    align-items: center;
  }
`;

const ToggleType = styled.div`
  display: flex;
  flex-direction: column;
  > * {
    padding-bottom: 0.2rem;
  }

  @media screen and (orientation: landscape) and (max-width: 896px) {
    flex-direction: row;
    align-items: center;
  }
`;

const Checkbox = styled.input`
  min-width: 15px;
  min-height: 15px;
  width: 15px;
  height: 15px;
`;

const ToggleSliderGroup = styled(ToggleGroup)`
  flex-direction: column;

  @media (max-width: 768px) {
    flex-basis: 100%;
    padding-left: calc(0.5rem + 15px);
  }
`;

const START_DATE = new Date('2020-01-23').setHours(0, 0, 0, 0);
const DIFFERENCE = new Date().setHours(23, 59, 59, 0) - START_DATE;
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
    transmissionClusterData,
    setDateRange,
    dateEndRange,
    selectedCase,
    selectedCluster
  } = props;
  const clusterLocations = transmissionClusterData.features.filter(({ properties: { type } }) => type === 'cluster');
  const otherLocations = transmissionClusterData.features.filter(({ properties: { type } }) => type === 'other');
  const hospitals = transmissionClusterData.features.filter(({ properties: { type } }) => type === 'hospital');
  const selectedCaseIndex = clusterData.features.findIndex(({ properties: { id } }) => id === selectedCase?.properties.id);
  const selectedLocationIndex = transmissionClusterData.features.findIndex(({ properties: { location } }) => location === selectedCluster?.properties.location);

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, type: Cluster) => {
    if (type === 'transmission') {
      toggleDisplayTransmissionClusters(e.target.checked);
    } else if (type === 'case') {
      toggleDisplayCaseClusters(e.target.checked);
    }
  };

  const handleSelect = (value: string, type: Cluster) => {
    if (type === 'transmission') {
      const selectedFeature = transmissionClusterData.features.find(({ properties: { location } }) => location ===  value);
      if (!selectedFeature) {
        return;
      }
      setSelectedCluster({
        ...selectedFeature,
        shouldTriggerZoom: true
      });
    } else if (type === 'case') {
      const selectedFeature = clusterData.features.find(({ properties: { id } }) => id === value);
      if (!selectedFeature) {
        return;
      }
      setSelectedCase({
        ...selectedFeature,
        shouldTriggerZoom: true
      });
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange(DAYS - Number(e.target.value));
  };

  return (
    <ControlWrapper>
      <ToggleGroup>
        <Checkbox
          type='checkbox'
          checked={displayTransmissionClusters}
          onChange={(e) => handleCheck(e, 'transmission')}
          disabled={!ready}
          id='transmissionClusters'
        />
        <ToggleType>
          <label htmlFor='transmissionClusters'>Locations</label>
          {/* <ClusterSelect
            id='jumptoCluster'
            disabled={!displayTransmissionClusters || !ready}
            onChange={(e) => handleClusterSelect(e, 'transmission')}
            value={selectedLocationIndex}
            aria-label='Go to selected location'
          >
            <option disabled value='-1'>- select a transmission cluster -</option>
            {
              clusterLocations.map(({ properties: { location } }, index) => <option key={location} value={index}>{location}</option>)
            }
            <option disabled>- notable locations -</option>
            {
              otherLocations.map(({ properties: { location } }, index) => <option key={location} value={clusterLocations.length + index}>{location}</option>)
            }
            <option disabled>- hospitals -</option>
            {
              hospitals.map(({ properties: { location } }, index) => <option key={location} value={clusterLocations.length + otherLocations.length + index}>{location}</option>)
            }
          </ClusterSelect> */}
          {/* <Suspense fallback={<div>Loading Options...</div>}>
            <Select
              aria-label='Go to selected location'
              placeholder='Select a Location'
              required
              options={groupedOptions}
              disabled={!displayTransmissionClusters || !ready}
            />
          </Suspense> */}
          <Select
            showSearch
            disabled={!displayTransmissionClusters || !ready}
            style={{ width: '200px', maxWidth: '100%' }}
            placeholder='Select a Location'
            optionFilterProp='children'
            onChange={(value: string) => handleSelect(value, 'transmission')}
            aria-label='Go to selected location'
          >
            <OptGroup label='Transmission Clusters'>
              {
                clusterLocations.map(({ properties: { location } }) => <Option key={location} value={location}>{location}</Option>)
              }
            </OptGroup>
            <OptGroup label='Notable Locations'>
              {
                otherLocations.map(({ properties: { location } }) => <Option key={location} value={location}>{location}</Option>)
              }
            </OptGroup>
            <OptGroup label='Hospitals'>
              {
                hospitals.map(({ properties: { location } }) => <Option key={location} value={location}>{location}</Option>)
              }
            </OptGroup>
          </Select>
        </ToggleType>
      </ToggleGroup>
      <ToggleGroup>
        <Checkbox
          type='checkbox'
          checked={displayCaseClusters}
          onChange={(e) => handleCheck(e, 'case')}
          disabled={!ready}
          id='caseClusters'
        />
        <ToggleType>
          <label htmlFor='caseClusters'>Cases Clusters</label>
          {/* <ClusterSelect
            id='jumptoCase'
            disabled={!ready}
            onChange={(e) => handleClusterSelect(e, 'case')}
            value={selectedCaseIndex}
            aria-label='Go to selected case'
          >
            <option disabled value='-1'>- select a case -</option>
            {
              clusterData.features.map(({ properties: { id, title } }: Feature<Point, PointProperties>, index) => <option key={id} value={index}>{title}</option>)
            }
          </ClusterSelect> */}
          <Select
            showSearch
            disabled={!ready}
            style={{ width: '200px' }}
            placeholder='Select a Case'
            optionFilterProp='children'
            onChange={(value: string) => handleSelect(value, 'case')}
            aria-label='Go to selected case'
          >
            {
              clusterData.features.map(({ properties: { id, title } }) =>  <Option key={id} value={id}>{title}</Option>)
            }
          </Select>
        </ToggleType>
      </ToggleGroup>
      <ToggleSliderGroup>
        <label htmlFor='rangeSliderInput'>Date Range:</label>
        <Slider
          id='rangeSliderInput'
          type='range'
          min='1'
          max={DAYS}
          onChange={handleRangeChange}
          step='1'
          defaultValue={DAYS}
          disabled={!ready}
        />
        <RangeSpan>2020-01-23 to {dateEndRange.toLocaleDateString('fr-CA')}</RangeSpan>
      </ToggleSliderGroup>
    </ControlWrapper>
  );
};

export default React.memo(Control);
