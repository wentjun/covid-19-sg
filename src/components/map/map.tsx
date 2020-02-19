import mapboxgl, { MapLayerMouseEvent, Map as MapboxContainer, GeoJSONSource } from 'mapbox-gl';
import React from 'react';
import styled from 'styled-components';
import { TaxiResponse } from '../../shared/models/taxi-response';
import { MapSchema } from '../../shared/models/enums';
import { PointProperties } from '../../shared/models/PointProperties';
import { ClusterLocation, ClusterZones } from '../../shared/models/ClusterZones';
import { FeatureCollection, Feature } from 'geojson';

export interface MapProps {
  mapReady: () => void;
  updateCurrentLocation: (longitude: number, latitude: number) => void;
  longitude: number;
  latitude: number;
  zoom: number;
  taxiLocations?: TaxiResponse;
  clusterData: FeatureCollection;
  transmissionClusterData: Feature;
  displayTransmissionClusters: boolean;
  selectedCluster?: ClusterLocation;
}

const MapWrapper = styled.div`
  width: 100vw;
  height: 100vh
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
  private map?: MapboxContainer;

  componentDidMount() {
    this.loadMap();
  }

  componentDidUpdate(prevProps: MapProps) {
    const { displayTransmissionClusters, selectedCluster, transmissionClusterData } = this.props;
    if (displayTransmissionClusters !== prevProps.displayTransmissionClusters) {
      if (displayTransmissionClusters) {
        this.map?.setLayoutProperty(MapSchema.TransmissionClusterLayer, 'visibility', 'visible');
      } else {
        this.map?.setLayoutProperty(MapSchema.TransmissionClusterLayer, 'visibility', 'none');
      }
    }

    if (selectedCluster !== prevProps.selectedCluster) {
      this.zoomToTransmissionCluster();
    }

    // const { locations } = transmissionClusterData.properties as ClusterZones;
    // console.log(transmissionClusterData);
    // console.log(locations.findIndex(location => location === selectedCluster));
  }

  componentWillUnmount() {
    this.map?.remove();
  }

  zoomToTransmissionCluster() {
    const { transmissionClusterData, selectedCluster } = this.props;
    const { geometry } = transmissionClusterData;
    const { locations } = transmissionClusterData.properties as ClusterZones;
    const polygonIndex = locations.findIndex(location => location === selectedCluster);
    this.map?.easeTo({
      // @ts-ignore
      center: geometry.coordinates[polygonIndex][0] as [number, number],
      zoom: 17
    });
  }

  loadMap() {
    const { longitude, latitude, zoom, mapReady } = this.props;
    this.map = new mapboxgl.Map({
      center: [longitude, latitude],
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v9?optimize=true',
      zoom,
      maxZoom: 18
    });
    this.map.doubleClickZoom.disable();
    this.map.on('load', () => {
      mapReady();
      this.loadCluster();
      this.onClusterClick();
      this.onPointClick();
      this.loadTransmissionClusterPolygons();
    });
  }

  loadCluster() {
    const { clusterData } = this.props;

    this.map?.addSource(MapSchema.Source, {
      type: 'geojson',
      data: clusterData,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });

    this.map?.addLayer({
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

    this.map?.addLayer({
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

    this.map?.addLayer({
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
    this.map?.on('click', MapSchema.Source, (e: MapLayerMouseEvent) => {
      const features = this.map?.queryRenderedFeatures(e.point, {
        layers: [MapSchema.Source]
      });
      const clusterId = features?.[0].properties?.cluster_id;
      const source = this.map?.getSource(MapSchema.Source) as GeoJSONSource;
      source.getClusterExpansionZoom(
        clusterId,
        (err: Error, zoom: number) => {
          const geometry = features?.[0]?.geometry;
          if (err || geometry?.type !== 'Point' || !geometry.coordinates) {
            return;
          }

          this.map?.easeTo({
            center: geometry.coordinates as [number, number],
            zoom
          });
        }
      );
    });
  }

  onPointClick() {
    this.map?.on('click', MapSchema.SinglePointLayer, (e: MapLayerMouseEvent) => {
      if (!e.features || e.features?.[0].geometry?.type !== 'Point') {
        return;
      }

      // zoom into point
      const { lng, lat } = e.lngLat;
      this.map?.easeTo({
        center: [lng, lat],
        zoom: this.map.getZoom() + 1
      });

      const { geometry, properties } = e.features?.[0];
      const { title, source, confirmed, hospital, discharged } = properties as PointProperties;
      const coordinates = geometry.coordinates.slice() as [number, number];
      while (Math.abs(lng - coordinates[0]) > 180) {
        coordinates[0] += lng > coordinates[0] ? 360 : -360;
      }

      // render popup
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`
          <h3>${title}</h3>
          <span>Confirmed on: </span><strong>${confirmed}</strong>
          <br />
          <span>Hospitalised at: </span><strong>${hospital}</strong>
          <br />
          ${discharged ? `<span>Discharged on: </span><strong>${discharged}</strong><br />` : ''}
          ${source ? `<a href=${source} target='_blank'>article</span>` : ''}
        `)
        .addTo(this.map as MapboxContainer);
    });
  }

  loadTransmissionClusterPolygons() {
    const { transmissionClusterData } = this.props;

    this.map?.addSource(MapSchema.TransmissionClusterSource, {
      type: 'geojson',
      data: transmissionClusterData
    });

    this.map?.addLayer({
      id: MapSchema.TransmissionClusterLayer,
      type: 'fill',
      source: MapSchema.TransmissionClusterSource,
      layout: {},
      paint: {
        'fill-color': '#088',
        'fill-opacity': 0.8
      }
    });
  }

  render() {
    return (
      <MapWrapper>
        <MapContainer ref={(e) => this.mapContainer = e} />
      </MapWrapper>
    );
  }
}

export default Map;
