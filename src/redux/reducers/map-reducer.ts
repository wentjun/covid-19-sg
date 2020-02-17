import { ActionType, getType } from 'typesafe-actions';

import * as actions from '../actions';
import { TaxiResponse } from '../../shared/models/taxi-response';

type Action = ActionType<typeof actions>;

export interface MapState {
  readonly ready: boolean;
  readonly latitude: number;
  readonly longitude: number;
  readonly zoom: number;
  readonly taxiLocations?: TaxiResponse;
}

const initialState = {
  ready: false,
  latitude: 51.5049375,
  longitude: -0.0964509,
  zoom: 14
};

export const mapReducer = (state: MapState = initialState, action: Action): MapState => {

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

    case getType(actions.updateTaxiLocations):
      return {
        ...state,
        taxiLocations: action.payload
      };

    default:
      return state;
  }
};
