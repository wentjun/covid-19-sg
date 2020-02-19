import { ActionType, getType } from 'typesafe-actions';

import * as actions from '../actions';

type Action = ActionType<typeof actions>;

export interface ControlState {
  readonly loading: boolean;
  readonly errorMessage?: string;
  readonly displayTransmissionClusters: boolean
}

const initialState: ControlState = {
  loading: false,
  displayTransmissionClusters: true
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
  }

};
