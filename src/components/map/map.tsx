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
}

interface MapState {
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

mapboxgl.accessToken = 'pk.eyJ1Ijoid2VudGp1biIsImEiOiJjandmODc5cngwcDJjNDNwYjhtOXZqejVtIn0.1l6XNJgy4pkY7TWEV58pVQ';

class Map extends React.Component<MapProps, MapState> {
  private mapContainer: any;
  private map: any;

  constructor(props: MapProps) {
    super(props);
  }

  componentDidMount() {
    this.loadMap();
  }

  componentDidUpdate() {
    this.updateTaxiLocations();
  }

  componentWillUnmount() {
    this.map.remove();
  }

  loadMap() {
    const { longitude, latitude, zoom } = this.props;
    this.map = new mapboxgl.Map({
      center: [longitude, latitude],
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom
    });
    // add zoom and rotation controls to the map.
    this.map.addControl(new mapboxgl.NavigationControl());
    // disable default "double click to zoom" behaviour
    this.map.doubleClickZoom.disable();
    this.map.on('load', () => {
      this.props.mapReady();
      this.loadCurrentLocationMarker();
      this.loadTaxiMarkersLayer();
    });
    // set center on double click event location
    this.updateCurrentLocationMarker();
  }

  loadCurrentLocationMarker() {
    const { longitude, latitude } = this.props;
    this.map.loadImage(Symbols.currentLocationMarker, (error: any, image: HTMLElement) => {
        if (error) {
          throw error;
        }
        this.map.addImage('currentLocationMarker', image);

        this.map.addSource('currentLocationSource', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [longitude, latitude]
              }
            }]
          }
        });
        this.map.addLayer({
          id: 'currentLocationLayer',
          type: 'symbol',
          layout: {
            'icon-image': 'currentLocationMarker',
            'icon-size': 0.4
          },
          source: 'currentLocationSource'
        });
      });
  }

  updateCurrentLocationMarker() {
    this.map.on('dblclick', (e: MapMouseEvent)  => {
      const { lng, lat } = e.lngLat;
      this.props.updateCurrentLocation(lng, lat);
      this.map.flyTo({
        center: [lng, lat],
        speed: 0.6,
        zoom: 14
      });
      const getCurrentLocationSource = this.map.getSource('currentLocationSource');
      const { latitude, longitude } = this.props;
      if (getCurrentLocationSource && latitude && longitude) {
        const updatedGeoJson = {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            }
          }]
        };
        getCurrentLocationSource.setData(updatedGeoJson);
      }
    });
  }

  loadTaxiMarkersLayer() {
    this.map.loadImage(Symbols.taxiMarker, (error: any, image: HTMLElement) => {
        if (error) {
          throw error;
        }
        this.map.addImage('taxiMarker', image);

        this.map.addSource('taxiSource', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });
        this.map.addLayer({
          id: 'taxiLayer',
          type: 'symbol',
          layout: {
            'icon-image': 'taxiMarker',
            'icon-size': 0.5,
            'icon-rotate': ['get', 'rotate']
          },
          source: 'taxiSource'
        });
        // ensure current location layer will have higher z-index priority over taxi layer
        this.map.moveLayer('currentLocationLayer');
      });
  }

  updateTaxiLocations() {
    const getTaxiSource = this.map.getSource('taxiSource');
    const { taxiLocations } = this.props;

    if (taxiLocations && getTaxiSource) {
      // map to response to geojson object
      const res = taxiLocations.drivers.map(driver => {
        const { longitude, latitude, bearing } = driver.location;
        return {
          type: 'Point',
          properties: {
            // set rotation for each marker based on bearing
            rotate: bearing
          },
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          }
        };
      });
      const updatedGeoJson = {
        type: 'FeatureCollection',
        features: res
      };
      // update taxi layer with updated geojson object
      getTaxiSource.setData(updatedGeoJson);
    }
  }

  render() {
    return(
      <MapWrapper>
        <MapContainer ref={el => this.mapContainer = el} />
      </MapWrapper>
    );
  }
}

export default Map;
