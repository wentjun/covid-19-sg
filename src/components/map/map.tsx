import mapboxgl, { MapLayerMouseEvent, Map as MapboxContainer, GeoJSONSource } from 'mapbox-gl';
import React from 'react';
import styled from 'styled-components';
import { TaxiResponse } from '../../shared/models/taxi-response';
import { MapSchema } from '../../shared/models/enums';
import { PointProperties } from '../../shared/models/PointProperties';
import { FeatureCollection } from 'geojson';

export interface MapProps {
  mapReady: () => void;
  updateCurrentLocation: (longitude: number, latitude: number) => void;
  longitude: number;
  latitude: number;
  zoom: number;
  taxiLocations?: TaxiResponse;
  clusterData: FeatureCollection;
  displayTransmissionClusters: boolean;
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

  constructor(props: MapProps) {
    super(props);
  }

  componentDidMount() {
    this.loadMap();
  }

  componentDidUpdate(prevProps: MapProps) {
    const { displayTransmissionClusters } = this.props;
    if (displayTransmissionClusters === prevProps.displayTransmissionClusters) {
      return ;
    }

    if (displayTransmissionClusters) {
      this.map?.setLayoutProperty(MapSchema.TransmissionClusterLayer, 'visibility', 'visible');
    } else {
      this.map?.setLayoutProperty(MapSchema.TransmissionClusterLayer, 'visibility', 'none');
    }
  }

  componentWillUnmount() {
    this.map?.remove();
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
    // @ts-ignore
    this.map?.addSource(MapSchema.TransmissionClusterSource, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates:[
            [[103.8162054,1.2942341],[103.8162448,1.2941594],[103.8164828,1.2941906],[103.8164886,1.2941627],[103.8165394,1.2941718],[103.8165296,1.2942161],[103.816601,1.2942259],[103.81661,1.2941701],[103.8166847,1.2941832],[103.8166773,1.2942481],[103.8166642,1.2942464],[103.8166256,1.2945911],[103.816555,1.2945911],[103.816555,1.2945788],[103.8164705,1.2945632],[103.8164746,1.2945427],[103.8164492,1.2945443],[103.8164451,1.2945558],[103.8162604,1.2944983],[103.8162743,1.2944475],[103.816262,1.2944442],[103.8162333,1.2943383],[103.8162218,1.294335],[103.8162095,1.2942825],[103.8162185,1.2942834],[103.8162054,1.2942341]],
            [[103.7472061,1.3649022],[103.7472129,1.3646251],[103.7472751,1.3646266],[103.7472744,1.3646549],[103.7474147,1.3646584],[103.7474152,1.3646376],[103.7474944,1.3646396],[103.7474936,1.3646754],[103.7476122,1.3646783],[103.7476065,1.364912],[103.7475686,1.3649111],[103.7475657,1.3650281],[103.7474985,1.3650264],[103.7475013,1.3649094],[103.7472061,1.3649022]],
            [[103.8616363,1.3109204],[103.8617648,1.3107418],[103.8618294,1.3107882],[103.8617009,1.3109668],[103.8616363,1.3109204]],
            [[103.8906279,1.327888],[103.8907128,1.3277274],[103.8909643,1.3278603],[103.8908797,1.3280203],[103.8906582,1.3279032],[103.890655,1.3279093],[103.8906475,1.3279155],[103.8906379,1.3279146],[103.8906317,1.3279071],[103.8906326,1.3278975],[103.8906356,1.327892],[103.8906279,1.327888]],
            [[103.833100,1.306790],[103.833787,1.306466],[103.833530,1.305930],[103.832846,1.306249]],
            [[103.864784, 1.406049],[103.865185, 1.406714],[103.865741,1.406528],[103.865447,1.405958]]
          ]
        },
        properties: {
          locations: ['Grace Assembly of God Church (Tanglin)', 'Grace Assembly of God Church (Bukit Batok)', 'Yong Thai Hang', 'The Life Church and Missions Singapore', 'Grand Hyatt Singapore', 'Seletar Aerospace Heights (polygons drawn for this location are an approximate)']
        }
      }
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
