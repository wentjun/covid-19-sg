import mapboxgl, {
  MapLayerMouseEvent, Map as MapboxContainer, GeoJSONSource, LngLatBounds, CirclePaint, NavigationControl,
} from 'mapbox-gl';
import React from 'react';
import styled from 'styled-components';
import { Feature, Point, Polygon } from 'geojson';
import ReactGA from 'react-ga';
import { createPortal } from 'react-dom';
import { MapSchema } from '../../shared/models/enums';
import { PointProperties } from '../../shared/models/PointProperties';
import { MapState } from '../../redux/reducers/map-reducer';
import { ControlState } from '../../redux/reducers/control-reducer';
import { LocationProperties } from '../../shared/models/Location';
import { Information } from './information';

export interface MapProps {
  mapReady: () => void;
  setSelectedCase: (selectedCase: Feature<Point, PointProperties>) => void;
  setSelectedCluster: (selectedCluster: Feature<Polygon, LocationProperties>) => void;
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
    'case',
    ['==', ['get', 'hasRecoveredOnRangeDate'], true],
    '#29f1c3',
    ['==', ['get', 'hasRecoveredOnRangeDate'], false],
    '#f15a22',
    ['==', ['get', 'discharged'], ''],
    '#f15a22',
    ['==', ['get', 'discharged'], true],
    '#29f1c3',
    '#29f1c3',
  ],
  'circle-radius': 6,
  'circle-stroke-width': [
    'case',
    // ['has', 'isActive'],
    ['==', ['get', 'isActive'], true],
    12,
    ['has', 'isDateEndRange'],
    6,
    1,
  ],
  'circle-stroke-color': [
    'case',
    // ['has', 'isActive'],
    ['==', ['get', 'isActive'], true],
    '#6c7a89',
    '#bdc3c7',
  ],
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
      clusterData,
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

    if ((selectedCase?.properties.id !== prevProps.selectedCase?.properties.id) && selectedCase?.shouldTriggerZoom) {
      this.flyToCase(selectedCase?.geometry.coordinates as [number, number]);
    }

    if (clusterData !== prevProps.clusterData) {
      const clusterSource = this.map?.getSource(MapSchema.Source) as GeoJSONSource;
      const unClusterSource = this.map?.getSource(MapSchema.UnclusteredSource) as GeoJSONSource;
      clusterSource.setData(clusterData);
      unClusterSource.setData(clusterData);
    }
  }

  componentWillUnmount() {
    this.map?.remove();
  }

  onTransmissionClusterClick() {
    const { setSelectedCluster, transmissionClusterData } = this.props;
    this.map?.on('click', MapSchema.TransmissionClusterLayer, (e: MapLayerMouseEvent) => {
      const features = this.map?.queryRenderedFeatures(e.point, {
        layers: [MapSchema.TransmissionClusterLayer],
      });
      if (features?.[0].geometry.type !== 'Polygon') {
        return;
      }
      const { geometry: { coordinates }, properties } = features[0];
      const polygonCoordinates = coordinates[0] as Array<[number, number]>;
      if (!properties) {
        return;
      }
      const { location } = properties as LocationProperties;
      const selectedCluster = transmissionClusterData.features.find((feature) => (
        feature.properties.location === location
      ));
      if (!selectedCluster) {
        return;
      }
      setSelectedCluster(selectedCluster);
      this.zoomIntoTransmissionClusterBounds(polygonCoordinates);
    });
  }

  onPointClick() {
    const handleClick = (e: MapLayerMouseEvent) => {
      const { setSelectedCase, clusterData } = this.props;
      const currentZoomLevel = this.map?.getZoom();
      if (!e.features || e.features?.[0].geometry?.type !== 'Point' || !currentZoomLevel) {
        return;
      }

      const { id } = e.features?.[0].properties as PointProperties;
      const selectedCase = (clusterData.features.filter((feature) => feature.properties.id === id))[0];
      setSelectedCase({
        ...selectedCase,
        properties: {
          ...selectedCase.properties,
          isActive: true,
        },
      });
      const { geometry: { coordinates } } = selectedCase;
      this.flyToCase(coordinates as [number, number]);

      // const features = this.map?.queryRenderedFeatures(e.point, {
      //   layers: [MapSchema.SinglePointLayer]
      // });
      // const a = this.map?.queryRenderedFeatures(e.point, {
      //   layers: [MapSchema.SinglePointLayer]
      // });
      // this.map?.setFeatureState(
      //   { source: MapSchema.Source, id: features?.[0].id },
      //   { hover: true }
      // );
    };

    this.map?.on('click', MapSchema.SinglePointLayer, (e: MapLayerMouseEvent) => {
      handleClick(e);
    });

    this.map?.on('click', MapSchema.SinglePointUnclusteredLayer, (e: MapLayerMouseEvent) => {
      handleClick(e);
    });
  }

  onClusterClick() {
    this.map?.on('click', MapSchema.ClusterLayer, (e: MapLayerMouseEvent) => {
      const features = this.map?.queryRenderedFeatures(e.point, {
        layers: [MapSchema.ClusterLayer],
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
            zoom,
          });
        },
      );
    });
  }

  loadCluster() {
    const { clusterData } = this.props;

    this.map?.addSource(MapSchema.Source, {
      type: 'geojson',
      data: clusterData,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
      generateId: true,
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
          '#f28cb1',
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,
          100,
          30,
          750,
          40,
        ],
      },
    });

    this.map?.addLayer({
      id: MapSchema.ClusterCountLayer,
      type: 'symbol',
      source: MapSchema.Source,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
      },
    });

    this.map?.addLayer({
      id: MapSchema.SinglePointLayer,
      type: 'circle',
      source: MapSchema.Source,
      filter: ['!', ['has', 'point_count']],
      paint: SINGLE_POINT_STYLE,
    });
  }

  loadMap() {
    const {
      longitude, latitude, zoom, mapReady,
    } = this.props;
    this.map = new MapboxContainer({
      center: [longitude, latitude],
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v9?optimize=true',
      zoom,
      maxZoom: 18,
    });
    this.map.doubleClickZoom.disable();
    this.map.on('load', () => {
      // ensure transmission cluster is "below" case point
      this.loadTransmissionClusterPolygons();
      this.loadCluster();
      this.loadUnclusteredCases();
      mapReady();
      this.onTransmissionClusterClick();
      this.onClusterClick();
      this.onPointClick();
      this.loadNavigationControl();
    });
  }

  zoomToTransmissionCluster() {
    const { selectedCluster } = this.props;
    if (!selectedCluster) {
      return;
    }
    const { geometry: { coordinates } } = selectedCluster;

    const polygonCoordinates = coordinates[0] as Array<[number, number]>;

    this.zoomIntoTransmissionClusterBounds(polygonCoordinates);
  }

  zoomIntoTransmissionClusterBounds(coordinates: Array<[number, number]>) {
    const clusterBounds = coordinates
      .reduce((bounds, coord) => bounds.extend(coord), new LngLatBounds(coordinates[0], coordinates[0]));

    this.map?.fitBounds(clusterBounds, {
      padding: 20,
      linear: true,
    });
  }

  flyToCase(coordinates: [number, number]) {
    const currentZoomLevel = this.map?.getZoom();
    if (!currentZoomLevel) {
      return;
    }
    this.map?.flyTo({
      center: coordinates,
      curve: 1.1,
      speed: 2,
      zoom: (currentZoomLevel > 16) ? currentZoomLevel : 16,
    });
  }

  loadTransmissionClusterPolygons() {
    const { transmissionClusterData } = this.props;

    this.map?.addSource(MapSchema.TransmissionClusterSource, {
      type: 'geojson',
      data: transmissionClusterData,
    });

    this.map?.addLayer({
      id: MapSchema.TransmissionClusterLayer,
      type: 'fill',
      source: MapSchema.TransmissionClusterSource,
      layout: {},
      paint: {
        'fill-color': '#f62459',
        'fill-opacity': 0.8,
      },
    });
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
      cluster: false,
    });

    this.map?.addLayer({
      id: MapSchema.SinglePointUnclusteredLayer,
      type: 'circle',
      source: MapSchema.UnclusteredSource,
      paint: SINGLE_POINT_STYLE,
    });

    this.map?.setLayoutProperty(MapSchema.SinglePointUnclusteredLayer, 'visibility', 'none');
  }

  loadNavigationControl() {
    this.map?.addControl(new NavigationControl(), 'bottom-right');
  }

  render() {
    const portalContainer = document.querySelector('.mapboxgl-ctrl-bottom-right');
    return (
      <MapWrapper>
        <MapContainer
          ref={(e) => {
            this.mapContainer = e;
          }}
        />
        { portalContainer
          ? createPortal(<Information />, portalContainer)
          : null }
      </MapWrapper>
    );
  }
}

export default Map;
