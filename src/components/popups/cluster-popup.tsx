import React from 'react';
import { TransmissionClusterProperties } from '../../shared/models/ClusterZones';

type ClusterPopupProps = TransmissionClusterProperties & {
  onCaseClick: (patient: number) => void;
};

const ClusterPopup: React.FC<ClusterPopupProps> = (props) => {
  const { cases, location, onCaseClick } = props;

  return <>
    <span>Location: <strong>{location}</strong></span>
    <br />
    <span>Cases: </span>
    <strong>
      {cases.map((patient: number, index) =>
        <span
          onClick={() => onCaseClick(patient)}
          key={index}
        >
          {`${(index ? ', ' : '')}#${patient}`}
        </span>
      )}
    </strong>
  </>
}

export default ClusterPopup;
