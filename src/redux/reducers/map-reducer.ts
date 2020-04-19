import { ActionType, getType } from 'typesafe-actions';
import { FeatureCollection, Polygon, Point } from 'geojson';
import * as actions from '../actions';
import covidData from '../../data/covid-sg.json';
import transmissionCluster from '../../data/locations.json';
import { LocationProperties } from '../../shared/models/Location';
import { PointProperties } from '../../shared/models/PointProperties';

type Action = ActionType<typeof actions>;

export interface MapState {
  readonly ready: boolean;
  readonly latitude: number;
  readonly longitude: number;
  readonly zoom: number;
  readonly clusterData: FeatureCollection<Point, PointProperties>;
  readonly transmissionClusterData: FeatureCollection<Polygon, LocationProperties>;
}

const initialState: MapState = {
  ready: false,
  latitude: 1.3550417673789497,
  longitude: 103.81799604387754,
  zoom: 9.8,
  clusterData: covidData as FeatureCollection<Point, PointProperties>,
  transmissionClusterData: transmissionCluster as FeatureCollection<Polygon, LocationProperties>,
};

export const mapReducer = (
  state: MapState = initialState,
  action: Action,
): MapState => {
  switch (action.type) {
    case getType(actions.mapReady):
      return {
        ...state,
        ready: true,
      };

    case getType(actions.setClusterData):
      return {
        ...state,
        clusterData: action.payload.clusterData,
      };

    default:
      return state;
  }
};
