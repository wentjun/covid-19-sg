import React from 'react';
import { PointProperties } from '../../shared/models/PointProperties';
import { Map, Popup } from 'mapbox-gl';
import ClusterPopup from './cluster-popup';
import { TransmissionClusterProperties } from '../../shared/models/ClusterZones';
import ReactDOM from 'react-dom';
import CasePopup from './case-popup';
import { MapSchema } from '../../shared/models/enums';

interface MapPopup {
  coordinates: [number, number];
  mapRef: Map;
  properties: TransmissionClusterProperties | PointProperties;
  type: 'case' | 'transmission';
}

const MapPopup: React.FC<MapPopup> = (props) => {
  const { coordinates, mapRef, properties, type } = props;
  const popupContent = document.createElement('div');
  if (type === 'transmission') {
    ReactDOM.render(
      <ClusterPopup
        {...properties as TransmissionClusterProperties}
        // to-do: handle clicking of each cases
        // onCaseClick={(e) => this.onCaseSelect(e)}
      />,
      popupContent
    );

    new Popup({ className: MapSchema.TransmissionPopup })
     .setLngLat(coordinates)
     .setDOMContent(popupContent)
     .addTo(mapRef);
  } else if (type === 'case') {
    ReactDOM.render(
      <CasePopup
       {...properties as PointProperties}
       // to-do: handle clicking of each cases
       // onCaseClick={(e) => this.onCaseSelect(e)}
      />,
      popupContent
    );

    new Popup({ className: MapSchema.CasePopup })
     .setLngLat(coordinates)
     .setDOMContent(popupContent)
     .addTo(mapRef);
  }

  return <></>;
};

export default MapPopup;
