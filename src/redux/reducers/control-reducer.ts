import { ActionType, getType } from 'typesafe-actions';
import * as actions from '../actions';
import { ClusterLocation } from '../../shared/models/ClusterZones';
import { PointProperties } from '../../shared/models/PointProperties';
import { Point, Feature } from 'geojson';

type Action = ActionType<typeof actions>;

export interface ControlState {
  readonly loading: boolean;
  readonly errorMessage?: string;
  readonly displayTransmissionClusters: boolean;
  readonly selectedCluster?: ClusterLocation;
  readonly displayCaseClusters: boolean;
  readonly selectedCase?: Feature<Point, PointProperties>;
  readonly dateEndRange: Date;
}

const initialState: ControlState = {
  loading: false,
  displayTransmissionClusters: true,
  displayCaseClusters: true,
  dateEndRange: new Date()
};

export const controlReducer = (
  state: ControlState = initialState,
  action: Action
): ControlState => {
  switch (action.type) {
    default:
      return state;

    case getType(actions.toggleDisplayTransmissionClusters):
      return {
        ...state,
        displayTransmissionClusters: action.payload.displayTransmissionClusters
      };

    case getType(actions.toggleDisplayCaseClusters):
      return {
        ...state,
        displayCaseClusters: action.payload.displayCaseClusters
      };

    case getType(actions.setSelectedCluster):
      return {
        ...state,
        selectedCluster: action.payload.selectedCluster
      };

    case getType(actions.setSelectedCase):
      return {
        ...state,
        selectedCase: action.payload.selectedCase
      };

    case getType(actions.setDateRange):
      const dateEndRange = new Date();
      dateEndRange.setDate(dateEndRange.getDate() - action.payload.numberOfDays + 1);

      return {
        ...state,
        dateEndRange
      };
  }

};
