import React from 'react';
import styled from 'styled-components';
import { MapState } from '../../redux/reducers/map-reducer';
import { ControlState } from '../../redux/reducers/control-reducer';

interface SummaryProps {
  clusterData: MapState['clusterData'];
  dateEndRange: ControlState['dateEndRange'];
}

interface DotProps {
  type: 'discharged' | 'hospitalised'
}

const SummaryWrapper = styled.div`
  background-color: rgba(0,0,0, 0.5);
  color: white;
  position: absolute;
  z-index: 3;
  bottom: 1rem;
  left: 1rem;
  padding: 0.5rem;
  font-size: 0.8rem;

  display: flex;
  flex-direction: column;
`;

const SummaryTitle = styled.div`
  text-decoration: underline;
`;

const dotColour = (type: DotProps['type']) => {
  switch (type) {
    case 'discharged':
      return '#29f1c3';
    case 'hospitalised':
      return '#f15a22';
  }
};

const Breakdown = styled.div`
  display: flex;
  align-items: center;
`;

const Dot = styled.span<DotProps>`
  height: 0.8rem;
  width: 0.8rem;
  background-color: ${({ type }) => dotColour(type)};
  border-radius: 50%;
  display: inline-block;
  margin-right: 0.5rem
`;

const Control: React.FC<SummaryProps> = (props) => {
  const { clusterData: { features }, dateEndRange } = props;
  const totalCases = features.length;
  const dischargedCases = (features.filter(({ properties }) =>
    new Date(properties.discharged) < new Date(dateEndRange))).length;
  const hospitalisedCases = totalCases - dischargedCases;

  return (
    <SummaryWrapper>
      <SummaryTitle>Summary ({dateEndRange.toLocaleDateString('fr-CA')})</SummaryTitle>
      <span>Total confirmed Cases: {totalCases}</span>
      <Breakdown>
        <Dot type='hospitalised'/>
        <span>Hospitalised: {hospitalisedCases}</span>
      </Breakdown>
      <Breakdown>
        <Dot type='discharged'/>
        <span>Discharged: {dischargedCases}</span>
      </Breakdown>
    </SummaryWrapper>
  );
};

export default Control;
