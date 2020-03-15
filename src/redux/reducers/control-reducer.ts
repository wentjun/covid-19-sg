import { ActionType, getType } from 'typesafe-actions';
import * as actions from '../actions';
import { LocationProperties } from '../../shared/models/Location';
import { PointProperties } from '../../shared/models/PointProperties';
import { Point, Feature, Polygon } from 'geojson';

type Action = ActionType<typeof actions>;
export type SelectedCase= Feature<Point, PointProperties> & {
  shouldTriggerZoom?: boolean;
};
export type SelectedCluster = Feature<Polygon, LocationProperties> & {
  shouldTriggerZoom?: boolean;
};

export interface ControlState {
  readonly loading: boolean;
  readonly errorMessage?: string;
  readonly displayTransmissionClusters: boolean;
  readonly selectedCluster: SelectedCluster | null;
  readonly displayCaseClusters: boolean;
  readonly selectedCase: SelectedCase | null;
  readonly dateEndRange: Date;
}

const initialState: ControlState = {
  loading: false,
  displayTransmissionClusters: true,
  displayCaseClusters: true,
  dateEndRange: new Date((new Date()).setHours(23, 59, 0, 0)),
  selectedCluster: null,
  selectedCase: null
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
      dateEndRange.setDate(dateEndRange.getDate() - action.payload.numberOfDays);
      dateEndRange.setHours(23, 59);

      return {
        ...state,
        dateEndRange
      };
  }

};
