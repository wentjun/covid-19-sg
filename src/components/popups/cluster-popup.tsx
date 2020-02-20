import React from 'react';
import { TransmissionClusterProperties } from '../../shared/models/ClusterZones';

type ClusterPopupProps = TransmissionClusterProperties;

const ClusterPopup: React.FC<ClusterPopupProps> = (props) => {
  const { cases, location } = props;

  return <>
    <span>Location: <strong>{location}</strong></span>
    <br />
    <span>Cases: </span>
    <strong>
      {cases.map((patient: number, index) => <span key={index}><a>{`${(index ? ', ' : '')}#${patient}`}</a></span>) }
    </strong>
  </>
}

export default ClusterPopup;
