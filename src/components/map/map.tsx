import mapboxgl, { MapMouseEvent } from 'mapbox-gl';
import React from 'react';
import styled from 'styled-components';

import { TaxiResponse } from '../../shared/models/taxi-response';
import { Symbols } from './symbols';

export interface MapProps {
  mapReady: () => void;
  updateCurrentLocation: (longitude: number, latitude: number) => void;
  longitude: number;
  latitude: number;
  zoom: number;
  taxiLocations?: TaxiResponse;
  clusterData: any;
}

const MapWrapper = styled.div`
  width: 75vw;
  @media all and (max-width: 1024px) {
    width: 100vw;
    height: 75vh;
  }
`;

const MapContainer = styled.div`
  bottom: 0;
  position: absolute;
  top: 0;
  width: inherit;
  height: inherit;
`;

mapboxgl.accessToken =
  'pk.eyJ1Ijoid2VudGp1biIsImEiOiJjandmODc5cngwcDJjNDNwYjhtOXZqejVtIn0.1l6XNJgy4pkY7TWEV58pVQ';

class Map extends React.Component<MapProps> {
  private mapContainer: any;
  private map: any;

  constructor(props: MapProps) {
    super(props);
  }

  componentDidMount() {
    this.loadMap();
  }

  componentDidUpdate() {
    // this.updateTaxiLocations();
  }

  componentWillUnmount() {
    this.map.remove();
  }

  loadMap() {
    const { longitude, latitude, zoom, mapReady } = this.props;
    this.map = new mapboxgl.Map({
      center: [longitude, latitude],
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom
    });
    // add zoom and rotation controls to the map.
    this.map.addControl(new mapboxgl.NavigationControl());
    // disable default 'double click to zoom' behaviour
    this.map.doubleClickZoom.disable();
    this.map.on('load', () => {
      mapReady();
      this.loadCluster();
      // this.loadCurrentLocationMarker();
      // this.loadTaxiMarkersLayer();
    });
  }

  loadCluster() {
    const { clusterData } = this.props;

    this.map.addSource('covid-cluster', {
      type: 'geojson',
      data: clusterData,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    this.map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'covid-cluster',
      filter: ['has', 'point_count'],
      paint: {
        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',
          100,
          '#f1f075',
          750,
          '#f28cb1'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,
          100,
          30,
          750,
          40
        ]
      }
    });

    this.map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'covid-cluster',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      }
    });

    this.map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'covid-cluster',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 4,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    });

  }

  render() {
    return (
      <MapWrapper>
        <MapContainer ref={el => (this.mapContainer = el)} />
      </MapWrapper>
    );
  }
}

export default Map;
