import mapboxgl, { MapMouseEvent } from 'mapbox-gl';
import React from 'react';
import styled from 'styled-components';

import { TaxiResponse } from '../../shared/models/taxi-response';
import { MapSchema } from '../../shared/models/enums';

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
    this.onMapMove();
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
      style: 'mapbox://styles/mapbox/dark-v9?optimize=true',
      zoom
    });
    this.map.doubleClickZoom.disable();
    this.map.on('load', () => {
      mapReady();
      this.loadCluster();
      this.onClusterClick();
      this.onPointClick();
    });
  }

  loadCluster() {
    const { clusterData } = this.props;

    this.map.addSource(MapSchema.Source, {
      type: 'geojson',
      data: clusterData,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });

    this.map.addLayer({
      id: MapSchema.Source,
      type: 'circle',
      source: MapSchema.Source,
      filter: ['has', 'point_count'],
      paint: {
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
      id: MapSchema.ClusterCountLayer,
      type: 'symbol',
      source: MapSchema.Source,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      }
    });

    this.map.addLayer({
      id: MapSchema.SinglePointLayer,
      type: 'circle',
      source: MapSchema.Source,
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 6,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    });
  }

  onClusterClick() {
    this.map.on('click', MapSchema.Source, (e: MapMouseEvent) => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: [MapSchema.Source]
      });
      const clusterId = features[0].properties.cluster_id;
      this.map.getSource(MapSchema.Source).getClusterExpansionZoom(
        clusterId,
        (err: Error, zoom: number) => {
          if (err) {
            return;
          }
          this.map.easeTo({
            center: features[0].geometry.coordinates,
            zoom
          });
        }
      );
    });
  }

  onPointClick() {
    this.map.on('click', MapSchema.SinglePointLayer, (e: MapMouseEvent) => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: [MapSchema.SinglePointLayer]
      });
      console.log(features);
      const { lng, lat } = e.lngLat;
      this.map.easeTo({
        center: [lng, lat],
        zoom: 13
      });
    });
  }

  onMapMove() {
    this.map.on('move', () => {
      const { lng, lat } = this.map.getCenter();

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
