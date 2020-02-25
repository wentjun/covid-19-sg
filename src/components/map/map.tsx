import mapboxgl, { MapLayerMouseEvent, Map as MapboxContainer, GeoJSONSource, LngLatBounds, CirclePaint, NavigationControl } from 'mapbox-gl';
import React from 'react';
import styled from 'styled-components';
import { MapSchema } from '../../shared/models/enums';
import { PointProperties } from '../../shared/models/PointProperties';
import { TransmissionClusterProperties } from '../../shared/models/ClusterZones';
import { Feature, Point } from 'geojson';
import { MapState } from '../../redux/reducers/map-reducer';
import ReactDOM from 'react-dom';
// import along from '@turf/along';
// import length from '@turf/length';
import { ControlState } from '../../redux/reducers/control-reducer';
import MapPopup from '../popups/popup';
import ReactGA from 'react-ga';

export interface MapProps {
  mapReady: () => void;
  longitude: number;
  latitude: number;
  zoom: number;
  clusterData: MapState['clusterData'];
  transmissionClusterData: MapState['transmissionClusterData'];
  displayTransmissionClusters: ControlState['displayTransmissionClusters'];
  displayCaseClusters: ControlState['displayCaseClusters'];
  selectedCluster: ControlState['selectedCluster'];
  selectedCase: ControlState['selectedCase'];
}

const MapWrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

const MapContainer = styled.div`
  bottom: 0;
  position: absolute;
  top: 0;
  width: inherit;
  height: inherit;
`;

const SINGLE_POINT_STYLE: CirclePaint = {
  'circle-color': [
    'match',
    ['get', 'discharged'],
    '',
    '#f15a22',
    '#29f1c3'
  ],
  'circle-radius': 6,
  'circle-stroke-width': [
    'case',
    ['has', 'isDateEndRange'],
    6,
    1
  ],
  'circle-stroke-color': '#bdc3c7'
};

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN as string;

class Map extends React.Component<MapProps> {
  private mapContainer: any;
  private map?: MapboxContainer;

  componentDidMount() {
    this.loadMap();
    this.loadAnalyticsTracking();
  }

  componentDidUpdate(prevProps: MapProps) {
    const {
      displayTransmissionClusters,
      selectedCluster,
      displayCaseClusters,
      selectedCase,
      clusterData
     } = this.props;

    if (displayTransmissionClusters !== prevProps.displayTransmissionClusters) {
      if (displayTransmissionClusters) {
        this.map?.setLayoutProperty(MapSchema.TransmissionClusterLayer, 'visibility', 'visible');
      } else {
        this.map?.setLayoutProperty(MapSchema.TransmissionClusterLayer, 'visibility', 'none');
      }
    }

    if (displayCaseClusters !== prevProps.displayCaseClusters) {
      if (displayCaseClusters) {
        this.map?.setLayoutProperty(MapSchema.ClusterCountLayer, 'visibility', 'visible');
        this.map?.setLayoutProperty(MapSchema.ClusterLayer, 'visibility', 'visible');
        this.map?.setLayoutProperty(MapSchema.SinglePointLayer, 'visibility', 'visible');
        this.map?.setLayoutProperty(MapSchema.SinglePointUnclusteredLayer, 'visibility', 'none');

      } else {
        this.map?.setLayoutProperty(MapSchema.ClusterCountLayer, 'visibility', 'none');
        this.map?.setLayoutProperty(MapSchema.ClusterLayer, 'visibility', 'none');
        this.map?.setLayoutProperty(MapSchema.SinglePointLayer, 'visibility', 'none');
        this.map?.setLayoutProperty(MapSchema.SinglePointUnclusteredLayer, 'visibility', 'visible');
      }
    }

    if (selectedCluster !== prevProps.selectedCluster) {
      this.zoomToTransmissionCluster();
    }

    if (selectedCase?.properties.id !== prevProps.selectedCase?.properties.id) {
      this.flyToCase(selectedCase?.geometry.coordinates as [number, number], selectedCase.properties);
    }

    if (clusterData.features.length !== prevProps.clusterData.features.length) {
      const clusterSource = this.map?.getSource(MapSchema.Source) as GeoJSONSource;
      const unClusterSource = this.map?.getSource(MapSchema.UnclusteredSource) as GeoJSONSource;
      clusterSource.setData(clusterData);
      unClusterSource.setData(clusterData);
    }
  }

  componentWillUnmount() {
    this.map?.remove();
  }

  zoomToTransmissionCluster() {
    const { transmissionClusterData: { features }, selectedCluster } = this.props;
    const polygon = features.find(polygon => polygon.properties?.location === selectedCluster);
    if (polygon?.geometry.type !== 'Polygon') {
      return;
    }
    const { properties, geometry: { coordinates } } = polygon;

    const polygonCoordinates = coordinates[0] as Array<[number, number]>;

    this.zoomIntoTransmissionClusterBounds(polygonCoordinates, properties);
  }

  loadMap() {
    const { longitude, latitude, zoom, mapReady } = this.props;
    this.map = new MapboxContainer({
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
      this.onTransmissionClusterClick();
      this.loadTransmissionClusterPolygons();
      this.loadUnclusteredCases();
      this.loadNavigationControl();
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
      id: MapSchema.ClusterLayer,
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
          20,
          25,
          30,
          30
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
      paint: SINGLE_POINT_STYLE
    });
  }

  onClusterClick() {
    this.map?.on('click', MapSchema.ClusterLayer, (e: MapLayerMouseEvent) => {
      const features = this.map?.queryRenderedFeatures(e.point, {
        layers: [MapSchema.ClusterLayer]
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
    const handleClick = (e: MapLayerMouseEvent) => {
      if (!e.features || e.features?.[0].geometry?.type !== 'Point') {
        return;
      }

      // zoom into point
      const { lng, lat } = e.lngLat;
      this.map?.easeTo({
        center: [lng, lat],
        zoom: 16
      });

      const { geometry, properties } = e.features?.[0];
      const coordinates = geometry.coordinates.slice() as [number, number];
      this.map?.once('moveend', () => {
        this.renderCasePopup(coordinates, properties as PointProperties);
      });
    };

    this.map?.on('click', MapSchema.SinglePointLayer, (e: MapLayerMouseEvent) => {
      handleClick(e);
    });

    this.map?.on('click', MapSchema.SinglePointUnclusteredLayer, (e: MapLayerMouseEvent) => {
      handleClick(e);
    });
  }

  onTransmissionClusterClick() {
    this.map?.on('click', MapSchema.TransmissionClusterLayer, (e: MapLayerMouseEvent) => {
      const features = this.map?.queryRenderedFeatures(e.point, {
        layers: [MapSchema.TransmissionClusterLayer]
      });
      if (features?.[0].geometry.type !== 'Polygon') {
        return;
      }
      const { geometry: { coordinates }, properties} = features[0];
      const polygonCoordinates = coordinates[0] as Array<[number, number]>;
      const processed = {
        ...properties,
        cases: JSON.parse(properties?.cases)
      } as TransmissionClusterProperties;
      this.zoomIntoTransmissionClusterBounds(polygonCoordinates, processed);
    });
  }

  zoomIntoTransmissionClusterBounds(coordinates: Array<[number, number]>, properties: TransmissionClusterProperties | null) {
    const bounds = coordinates.reduce((bounds: any, coord: any) => {
      return bounds.extend(coord);
    }, new LngLatBounds(coordinates[0], coordinates[0]));

    this.map?.fitBounds(bounds, {
      padding: 20,
      linear: true
    });
    this.map?.once('moveend', () => {
      const popupLocation = this.map?.getCenter();

      if (!popupLocation || !properties) {
        return;
      }

      const existingTransmissionPopup = (document.getElementsByClassName(MapSchema.TransmissionPopup))[0];
      existingTransmissionPopup?.parentNode?.removeChild(existingTransmissionPopup);

      const popupContent = document.createElement('div');

      const { lng, lat } = popupLocation;
      if (this.map) {
        ReactDOM.render(
          <MapPopup
            coordinates={[lng, lat]}
            mapRef={this.map}
            properties={properties}
            type='transmission'
            onCaseClick={(e) => this.onCaseSelect(e)}
          />,
          popupContent
        );
      }
    });
  }

  onCaseSelect(e: number) {
    const { clusterData } = this.props;
    const selectedCase = clusterData.features.find((feature: Feature<Point, PointProperties>) => feature.properties.id === `case-${e}`);
    if (!selectedCase) {
      return;
    }
    const { geometry: { coordinates }, properties } = selectedCase;

    this.flyToCase(coordinates as [number, number], properties);
  }

  flyToCase(coordinates: [number, number], properties: PointProperties) {
    this.map?.flyTo({
      center: coordinates,
      curve: 1.1,
      speed: 2,
      zoom: 16
    });

    this.map?.once('moveend', () => {
      this.renderCasePopup(coordinates as [number, number], properties);
    });
  }

  // todo: how to best display lines between cluster and cases?
  // onCaseSelect(e: number, clusterPoint: Position): any {
  //   const { clusterData } = this.props;
  //   const selectedCase = clusterData.features.find((feature: Feature<Point, PointProperties>) => feature.properties.id === `case-${e}`);
  //   if (!selectedCase) {
  //     return;
  //   }
  //   const { geometry: { coordinates } } = selectedCase;
  //   const arc = [];
  //
  //   const route: FeatureCollection = {
  //     type: 'FeatureCollection',
  //     features: [
  //       {
  //         type: 'Feature',
  //         properties: {},
  //         geometry: {
  //           type: 'LineString',
  //           coordinates: [coordinates, clusterPoint]
  //         }
  //       }
  //     ]
  //   };
  //   const distance = length(route)
  //   const steps = 500;
  //   if (route.features[0].geometry.type !== 'LineString') {
  //     return;
  //   }
  //   for (let i = 0; i < distance; i += distance / steps) {
  //     // @ts-ignore
  //     const segment = along(route.features[0], i, { units: 'kilometers' });
  //     arc.push(segment.geometry.coordinates);
  //   }
  //   route.features[0].geometry.coordinates = arc;
  //
  //   this.map?.addSource('route', {
  //     type: 'geojson',
  //     data: route
  //   });
  //
  //   this.map?.addLayer({
  //     id: 'route',
  //     source: 'route',
  //     type: 'line',
  //     paint: {
  //       'line-width': 2,
  //       'line-color': '#007cbf'
  //     }
  //   });
  // }

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
        'fill-color': '#f62459',
        'fill-opacity': 0.8
      }
    // ensure transmission cluster is "below" case point
    }, MapSchema.SinglePointLayer);
  }

  renderCasePopup(coordinates: [number, number], properties: PointProperties) {
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    // while (Math.abs(lng - coordinates[0]) > 180) {
    //   coordinates[0] += lng > coordinates[0] ? 360 : -360;
    // }
    const popupContent = document.createElement('div');

    const existingCasePopup = (document.getElementsByClassName(MapSchema.CasePopup))[0];
    existingCasePopup?.parentNode?.removeChild(existingCasePopup);

    if (this.map) {
      ReactDOM.render(
        <MapPopup
          coordinates={coordinates}
          mapRef={this.map}
          properties={properties}
          type='case'
        />,
        popupContent
     );
    }
  }

  loadAnalyticsTracking() {
    ReactGA.initialize('UA-158894958-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  loadUnclusteredCases() {
    const { clusterData } = this.props;
    this.map?.addSource(MapSchema.UnclusteredSource, {
      type: 'geojson',
      data: clusterData,
      cluster: false
    });

    this.map?.addLayer({
      id: MapSchema.SinglePointUnclusteredLayer,
      type: 'circle',
      source: MapSchema.UnclusteredSource,
      paint: SINGLE_POINT_STYLE
    });

    this.map?.setLayoutProperty(MapSchema.SinglePointUnclusteredLayer, 'visibility', 'none');
  }

  loadNavigationControl() {
    this.map?.addControl(new NavigationControl(), 'top-right');
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
