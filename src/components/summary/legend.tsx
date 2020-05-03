import React from 'react';
import styled from 'styled-components';
import { MapState } from '../../redux/reducers/map-reducer';
import { ControlState } from '../../redux/reducers/control-reducer';

interface LegendProps {
  clusterData: MapState['clusterData'];
  dateEndRange: ControlState['dateEndRange'];
}

interface DotProps {
  type: 'discharged' | 'hospitalised';
}

const SummaryWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
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
    default:
    case 'hospitalised':
      return '#f15a22';
    case 'discharged':
      return '#29f1c3';
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
  margin-right: 0.3rem;
`;

const UpArrow = styled.div<DotProps>`
  width: 0;
  height: 0;
  border-left: 0.4rem solid transparent;
  border-right: 0.4rem solid transparent;
  border-bottom: 0.4rem solid ${({ type }) => dotColour(type)};
  margin: 0 0.3rem;
`;

const NON_COVID_DEATHS = [4754, 3381, 1604, 8190, 17410];

export const Legend: React.FC<LegendProps> = (props) => {
  const { clusterData: { features }, dateEndRange } = props;
  const totalCases = features.length;
  const dischargedCases = (features.filter(({ properties: { discharged, id } }) => (
    new Date(discharged) < new Date(dateEndRange) && !NON_COVID_DEATHS.includes(Number(id.split('-')[1]))
  ))).length;
  const deathCases = (features.filter(({ properties: { death, id } }) => (
    new Date(death) < new Date(dateEndRange) && !NON_COVID_DEATHS.includes(Number(id.split('-')[1]))
  ))).length;
  const hospitalisedCases = totalCases - dischargedCases - deathCases;

  const mostRecentDateConfirmed = Math.max.apply(null, features.map((e) => +new Date(e.properties.confirmed)));
  const mostRecentDateDischarged = Math.max.apply(
    null,
    features.map((e) => (e.properties.discharged ? +new Date(e.properties.discharged) : 0)),
  );
  const mostRecentDateDeath = Math.max.apply(
    null,
    features.map((e) => (e.properties.death ? +new Date(e.properties.death) : 0)),
  );

  const latestConfirmedCount = (features.filter((feature) => (
    new Date(feature.properties.confirmed).getTime() === mostRecentDateConfirmed))
  ).length;
  const latestDischargedCount = (features.filter((feature) => (
    new Date(feature.properties.discharged).getTime() === mostRecentDateDischarged))
  ).length;
  const latestDeathCount = (features.filter((feature) => (
    new Date(feature.properties.death).getTime() === mostRecentDateDeath))
  ).length;

  return (
    <SummaryWrapper>
      <SummaryTitle>
        Summary (
        {dateEndRange.toLocaleDateString('fr-CA')}
        )
      </SummaryTitle>
      <span>
        Total confirmed Cases:
        {' '}
        {totalCases}
      </span>
      <Breakdown>
        <Dot type='hospitalised' />
        <span>
          Hospitalised:
          {' '}
          {hospitalisedCases}
        </span>
        <UpArrow type='hospitalised' />
        <span>{latestConfirmedCount}</span>
      </Breakdown>
      <Breakdown>
        <Dot type='discharged' />
        <span>
          Discharged:
          {dischargedCases}
        </span>
        <UpArrow type='discharged' />
        <span>{latestDischargedCount}</span>
      </Breakdown>
      <Breakdown>
        <Dot type='hospitalised' />
        <span>
          Deaths:
          {' '}
          {deathCases}
        </span>
        <UpArrow type='hospitalised' />
        <span>{latestDeathCount}</span>
      </Breakdown>
      <Breakdown>
        <Dot type='hospitalised' />
        <span>
          Deaths (non-COVID):
          {' '}
          {NON_COVID_DEATHS.length}
        </span>
      </Breakdown>
    </SummaryWrapper>
  );
};

export default React.memo(Legend);
