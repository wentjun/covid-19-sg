import { ActionType, getType } from 'typesafe-actions';
import * as actions from '../actions';
import covidData from '../../data/covid-sg.json';
import transmissionCluster from '../../data/transmission-cluster.json';
import { FeatureCollection, Polygon } from 'geojson';
import { TransmissionClusterProperties } from '../../shared/models/ClusterZones';

type Action = ActionType<typeof actions>;

export interface MapState {
  readonly ready: boolean;
  readonly latitude: number;
  readonly longitude: number;
  readonly zoom: number;
  readonly clusterData: FeatureCollection;
  readonly transmissionClusterData: FeatureCollection<Polygon, TransmissionClusterProperties>;
}

const initialState: MapState = {
  ready: false,
  latitude: 1.3550417673789497,
  longitude: 103.81799604387754,
  zoom: 9.8,
  clusterData: covidData as FeatureCollection,
  transmissionClusterData: transmissionCluster as FeatureCollection<Polygon, TransmissionClusterProperties>
};

export const mapReducer = (
  state: MapState = initialState,
  action: Action
): MapState => {
  switch (action.type) {
    case getType(actions.mapReady):
      return {
        ...state,
        ready: true
      };

    case getType(actions.updateCurrentLocation):
      return {
        ...state,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude
      };

    default:
      return state;
  }
};
