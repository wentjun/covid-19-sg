import React from 'react';
import { PointProperties } from '../../shared/models/PointProperties';

export type CasePopupProps = PointProperties;

const CasePopup: React.FC<CasePopupProps> = (props) => {
  const { title, confirmed, hospital, discharged, source } = props;

  return <>
    <h3>{title}</h3>
    <span>Confirmed on: </span><strong>{confirmed}</strong>
    <br />
    <span>Hospitalised at: </span><strong>{hospital}</strong>
    <br />
    {
      discharged
        ? <><span>Discharged on: </span><strong>{discharged}</strong><br /></>
        : null
    }
    {
      source
        ? <a href={source} target='_blank' rel='noopener noreferrer'>article</a>
        : null
    }
  </>
}

export default CasePopup;
